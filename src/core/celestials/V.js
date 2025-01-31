import { BitUpgradeState, GameMechanicState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";
import { DC } from "../constants";

import { SpeedrunMilestones } from "../speedrun";

import { Quotes } from "./quotes";

/**
 * Information about how to format runUnlocks:
 * id: unique id
 * name: the achievement name
 * description: Description what you need to do, for values add {value}
 * values: different values to display and check against the game
 * condition: function that takes the current value as an argument, if true completes an achievement
 * format: optional function that formats the value, defaults to format()
 */

class VRunUnlockState extends GameMechanicState {
  get completions() {
    const completions = player.celestials.v.runUnlocks[this.id];
    return completions === undefined ? 0 : completions;
  }

  get conditionBaseValue() {
    const value = this.config.values[this.completions];
    return value === undefined ? this.config.values[this.completions - 1] : value;
  }

  get canBeReduced() {
    return this.completions < this.config.values.length && this.completions !== 0 &&
      new Decimal(this.reduction).neq(this.config.maxShardReduction(this.conditionBaseValue));
  }

  get isReduced() {
    if (player.celestials.v.goalReductionSteps[this.id] === 0) return false;
    return (VUnlocks.shardReduction.canBeApplied && this.reduction.gt(0));
  }

  get reductionCost() {
    const stepCount = this.config.reductionStepSize ? this.config.reductionStepSize : 1;
    if (this.config.isHard) {
      // The numbers come from inside of nextHardReductionCost, this is an effective bulk-buy factor
      const modifiedStepCount = (Math.pow(1.15, stepCount) - 1) / 0.15;
      return modifiedStepCount * V.nextHardReductionCost(player.celestials.v.goalReductionSteps[this.id]);
    }
    else if (this.config.isExtreme) {
      const modifiedStepCount = (Math.pow(15, stepCount) - 1) / 14;
      return modifiedStepCount * V.nextExtremeReductionCost(player.celestials.v.goalReductionSteps[this.id]);
    }
    return stepCount * V.nextNormalReductionCost();
  }

  get tiersReduced() {
    return player.celestials.v.goalReductionSteps[this.id] / 100;
  }

  get reduction() {
    const value = this.conditionBaseValue;
    return Decimal.clamp(this.config.shardReduction(this.tiersReduced), 0, this.config.maxShardReduction(value));
  }

  get conditionValue() {
    let value = this.conditionBaseValue;
    if (!this.isReduced) return value;
    if (value instanceof Decimal) {
      value = value.sub(this.reduction);
    } else {
      value = Decimal.sub(value, this.reduction).toNumber();
    }
    return value;
  }

  get formattedDescription() {
    return this.config.description(this.conditionValue);
  }

  set completions(value) {
    player.celestials.v.runUnlocks[this.id] = value;
  }

  reset(){
    const V = player.celestials.v;
    V.runUnlocks[this.id] = 0;
    if(this.id == 0) V.runRecords[this.id] = -10;
    else if (this.id == 6) V.runRecords[this.id] = 0;
    else  V.runRecords[this.id] = DC.D0;
  }

  tryComplete() {
    const playerData = player.celestials.v;
    const value = this.config.currentValue();
    if (this.config.condition() && Decimal.gte(value, playerData.runRecords[this.id])) {
      playerData.runRecords[this.id] = value;
      playerData.runGlyphs[this.id] = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    while (this.completions < this.config.values.length &&
    Decimal.gte(playerData.runRecords[this.id], this.conditionValue) && this.config.condition(this.conditionValue)) {
      if (!V.isHard && this.config.isHard) continue;
      if (!V.isExtreme && this.config.isExtreme) continue;
      this.completions++;
      GameUI.notify.success(`You have unlocked V-Achievement
        '${this.config.name}' tier ${formatInt(this.completions)}`);

      V.updateTotalRunUnlocks();

      for (const quote of V.quotes.all) {
        // Quotes without requirements will be shown in other ways
        if (quote.requirement) {
          quote.show();
        }
      }
    }
  }
}

class VUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.v.unlockBits; }
  set bits(value) { player.celestials.v.unlockBits = value; }

  get pelleDisabled() {
    return Pelle.isDoomed && this !== VUnlocks.vAchievementUnlock;
  }

  get isEffectActive() {
    return this.isUnlocked && !this.pelleDisabled;
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description()
      : this.config.description;
  }

  get rewardText() {
    return typeof this.config.reward === "function" ? this.config.reward()
      : this.config.reward;
  }

  get canBeUnlocked() {
    return this.config.requirement() && !this.isUnlocked;
  }

  get formattedEffect() {
    if (!this.config.effect || !this.config.format) return "";

    return this.config.format(this.effectValue);
  }

  onUnlock() {
    GameUI.notify.success(this.description);
  }
}

/**
 * @param {number} id
 * @return {VRunUnlockState}
 */
export const VRunUnlock = VRunUnlockState.createAccessor(GameDatabase.celestials.v.runUnlocks);

export const VRunUnlocks = {
  /**
   * @type {VRunUnlockState[]}
   */
  all: VRunUnlock.index.compact(),
};

export const VUnlocks = mapGameDataToObject(
  GameDatabase.celestials.v.unlocks,
  config => new VUnlockState(config)
);

export const V = {
  displayName: "V",
  possessiveName: "V's",
  spaceTheorems: DC.D0,
  checkForUnlocks() {
    for (const unl of VUnlocks.all) {
      if (unl === VUnlocks.vAchievementUnlock) continue;
      unl.unlock();
    }

    if (this.isRunning || this.isRunningExtreme) {
      for (const unlock of VRunUnlocks.all) {
        unlock.tryComplete();
      }
      if (this.spaceTheorems.gte(36)) SpeedrunMilestones(22).tryComplete();
    }

    if (VUnlocks.raUnlock.canBeApplied && !Ra.unlocks.autoTP.canBeApplied) {
      Ra.checkForUnlocks();
    }
  },
  get canUnlockCelestial() {
    return VUnlocks.vAchievementUnlock.canBeUnlocked;
  },
  unlockCelestial() {
    player.celestials.v.unlockBits |= (1 << VUnlocks.vAchievementUnlock.id);
    GameUI.notify.success("You have unlocked V, The Celestial Of Achievements!", 10000);
    V.quotes.unlock.show();
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.v.run = true;
    this.quotes.realityEnter.show();
  },
  initializeExtremeRun() {
    clearCelestialRuns();
    player.celestials.v.runExtreme = true;
  },
  updateTotalRunUnlocks() {
    let sum = 0;
    if (realityUGs.all[8].isBought) sum += 10;
    for (let i = 0; i < player.celestials.v.runUnlocks.length; i++) {
      if (i < 6) sum += player.celestials.v.runUnlocks[i];
      else if (i < 10) sum += player.celestials.v.runUnlocks[i] * 2;
      else sum += player.celestials.v.runUnlocks[i] * 5;
    }
    this.spaceTheorems = player.celestials.v.metaTheorems.add(sum);
  },
  reset() {
    const v = player.celestials.v;
    
    if (!MetaFabricatorUpgrade(14).isBought) {
      v.unlockBits = 0;
      v.run = false;
      v.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      v.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      v.runGlyphs = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      v.runRecords = [-10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    v.metaTheorems = DC.D0;
    v.STSpent = DC.D0;
    this.spaceTheorems = DC.D0;
  },
  get availableST() {
    return V.spaceTheorems.sub(player.celestials.v.STSpent);
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get isRunningExtreme() {
    return player.celestials.v.runExtreme;
  },
  get isHard() {
    return Ra.unlocks.unlockHardV.isUnlocked;
  },
  get isExtreme() {
    return GlitchSpeedUpgrade(4).isBought;
  },
  get isFullyCompleted() {
    if(this.isExtreme) return this.spaceTheorems.gte(230);
    return this.spaceTheorems.gte(110);
  },
  get rageDimPower() {
    return MetaFabricatorUpgrades.all[4].effectOrDefault(DC.D1).mul(1e-3).pow(VRunUnlock(10).completions);
  },
  get rageTickPower() {
    return MetaFabricatorUpgrades.all[4].effectOrDefault(DC.D1).mul(1e-3).pow(VRunUnlock(10).completions);
  },
  nextNormalReductionCost() {
    return 1000;
  },
  nextHardReductionCost(currReductionSteps) {
    return 1000 * Math.pow(1.15, currReductionSteps);
  },
  nextExtremeReductionCost(currReductionSteps) {
    return 1e8 * Math.pow(12, currReductionSteps);
  },
  quotes: Quotes.v,
  symbol: "⌬"
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.v.isOpen) V.quotes.initial.show();
  if (Tab.celestials.v.isOpen && V.isExtreme) V.quotes.extremeUnlocked.show();
});
