import TWEEN from "tween.js";
import { ElectronRuntime, SteamRuntime } from "@/steam";
import { DC } from "./core/constants";
import { deepmergeAll } from "@/utility/deepmerge";
import { DEV } from "@/env";
import { SpeedrunMilestones } from "./core/speedrun";
import { Cloud } from "./core/storage";
import { supportedBrowsers } from "./supported-browsers";

import Payments from "./core/payments";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

export function playerInfinityUpgradesOnReset() {

  const infinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "ipOffline"]
  );

  const breakInfinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "totalMult", "currentMult", "postGalaxy",
      "challengeMult", "achievementMult", "infinitiedMult",
      "infinitiedGeneration", "autoBuyerUpgrade", "autobuyMaxDimboosts",
      "ipOffline"]
  );

  if (PelleUpgrade.keepBreakInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => breakInfinityUpgrades.has(u)));
    return;
  }

  if (PelleUpgrade.keepInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => infinityUpgrades.has(u)));
    player.infinityRebuyables = [0, 0, 0];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    return;
  }

  if ((RealityUpgrade(10).isBought && !Glitch.isRunning) || EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = breakInfinityUpgrades;
    player.infinityRebuyables = [8, 7, 10];
  } else if (EternityMilestone.keepInfinityUpgrades.isReached) {
    player.infinityUpgrades = infinityUpgrades;
    player.infinityRebuyables = [0, 0, 0];
  } else {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [0, 0, 0];
  }

  if (Pelle.isDoomed) {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [0, 0, 0];
  }

  GameCache.tickSpeedMultDecrease.invalidate();
  GameCache.dimensionMultDecrease.invalidate();
}

export function breakInfinity() {
  if (!Autobuyer.bigCrunch.hasMaxedInterval) return;
  if (InfinityChallenge.isRunning) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  // There's a potential migration edge case involving already-maxed autobuyers; this should give the achievement
  Achievement(61).tryUnlock();
  player.break = !player.break;
  TabNotification.ICUnlock.tryTrigger();
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
}

export function gainedInfinityPoints() {
  const div = Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  );
  if (Pelle.isDisabled("IPMults")) {
    let x = Decimal.add(1)
    x = x.times(preInfinityUGs.all[6].effectOrDefault(1));
    x = x.times(preInfinityUGs.all[7].effectOrDefault(1));

    x = x.times(breakInfinityUGs.all[0].effectOrDefault(1));
    x = x.times(breakInfinityUGs.all[1].effectOrDefault(1));
    x = x.times(breakInfinityUGs.all[3].effectOrDefault(1));

    x = x.times(GlitchRifts.alpha.milestones[3].effectOrDefault(1));
    
    return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75)
      .timesEffectsOf(PelleRifts.vacuum)
      .times(Pelle.specialGlyphEffect.infinity).times(x)
      .floor();
  }
  let ip = player.break
    ? Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75)
    : new Decimal(308 / div);
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
    ip = ip.min(DC.E200);
  }
  ip = ip.times(GameCache.totalIPMult.value);
  
  ip = ip.times(preInfinityUGs.all[6].effectOrDefault(1));
  ip = ip.times(preInfinityUGs.all[7].effectOrDefault(1));

  ip = ip.times(breakInfinityUGs.all[0].effectOrDefault(1));
  ip = ip.times(breakInfinityUGs.all[1].effectOrDefault(1));
  ip = ip.times(breakInfinityUGs.all[2].effectOrDefault(1));
  ip = ip.times(breakInfinityUGs.all[3].effectOrDefault(1));
  
  ip = ip.pow(MetaMilestone.metaProgress.effectOrDefault(1));

  if (Teresa.isRunning) {
    ip = ip.pow(0.55 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunning) {
    ip = ip.pow(0.5 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunningExtreme) {
    ip = ip.pow(0.01);
  }
  if (Laitela.isRunning) {
    ip = dilatedValueOf(ip, true);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }
  
  return ip.floor();
}

function totalEPMult() {
  return Pelle.isDisabled("EPMults")
    ? Pelle.specialGlyphEffect.time.timesEffectOf(PelleRifts.vacuum.milestones[2])
    : getAdjustedGlyphEffect("cursedEP")
      .times(ShopPurchase.EPPurchases.currentMult)
      .timesEffectsOf(
        EternityUpgrade.epMult,
        TimeStudy(61),
        TimeStudy(122),
        TimeStudy(121),
        TimeStudy(123),
        RealityUpgrade(12),
        GlyphEffect.epMult
      );
}

export function gainedEternityPoints() {
  let ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(
    gainedInfinityPoints()).log10() / (308 - PelleRifts.recursion.effectValue.toNumber()) - 0.7).times(totalEPMult());
    ep = ep.times(eternityUGs.all[0].effectOrDefault(1));
    ep = ep.times(eternityUGs.all[4].effectOrDefault(1));
    ep = ep.times(realityUGs.all[0].effectOrDefault(1));
  
  ep = ep.pow(MetaMilestone.metaProgress.effectOrDefault(1));

  if (Teresa.isRunning) {
    ep = ep.pow(0.55 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunning) {
    ep = ep.pow(0.5 * GlitchSpeedUpgrades.all[0].effectOrDefault(1));
  }
  if (V.isRunningExtreme) {
    ep = ep.pow(0.01);
  }
  if (Laitela.isRunning) {
    ep = dilatedValueOf(ep, true);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }

  return ep.floor();
}

export function requiredIPForEP(epAmount) {
  return Decimal.pow10(308 * (Decimal.log(Decimal.divide(epAmount, totalEPMult()), 5) + 0.7))
    .clampMin(Number.MAX_VALUE);
}

export function gainedGlyphLevel() {
  const glyphState = getGlyphLevelInputs();
  let rawLevel = Math.floor(glyphState.rawLevel);
  if (!isFinite(rawLevel)) rawLevel = 0;
  let actualLevel = Math.floor(glyphState.actualLevel);
  if (!isFinite(actualLevel)) actualLevel = 0;
  return {
    rawLevel,
    actualLevel
  };
}

export function gainedMetas() {
  let metas = DC.D1;

  metas = metas.mul(MetaFabricatorUpgrade(21).effectOrDefault(1));
  metas = metas.mul(Ra.unlocks.nullMetaBoost.effectOrDefault(1));

  return metas;
}

export function gainedMetaRelays() {
  let mr = (MetaFabricatorUpgrade(23).isBought && !Pelle.isDoomed) ? Decimal.pow10(Math.log10(player.records.thisMeta.maxAM.log10()) / 10).add(1) : DC.D1;
  mr = mr.add(Currency.metas.value);
  mr = mr.mul(MetaMilestone.metaSpeed.effectOrDefault(1));
  mr = mr.mul(MetaFabricatorUpgrade(13).effectOrDefault(1));
  mr = mr.mul(Ra.unlocks.nullMetaAntimatter.effectOrDefault(1));
  mr = mr.mul(Ra.unlocks.canteMetaBoost.effectOrDefault(1));
  return mr.floor();
}


export function resetChallengeStuff() {
  player.chall2Pow = 1;
  player.chall3Pow = DC.D0_01;
  Currency.matter.reset();
  player.chall8TotalSacrifice = DC.D1;
  player.postC4Tier = 1;
}

export function ratePerMinute(amount, time) {
  return Decimal.divide(amount, time instanceof Decimal ? time.div(60 * 1000) : time / (60 * 1000));
}

// eslint-disable-next-line max-params
export function addInfinityTime(time, realTime, ip, infinities) {
  let challenge = "";
  if (player.challenge.normal.current) challenge = `Normal Challenge ${player.challenge.normal.current}`;
  if (player.challenge.infinity.current) challenge = `Infinity Challenge ${player.challenge.infinity.current}`;
  player.records.recentInfinities.pop();
  player.records.recentInfinities.unshift([time, realTime, ip, infinities, challenge]);
  GameCache.bestRunIPPM.invalidate();
}

export function resetInfinityRuns() {
  player.records.recentInfinities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, DC.D1, ""]
  );
  GameCache.bestRunIPPM.invalidate();
}

// Player gains 50% of infinities they would get based on their best infinities/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
export function getInfinitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisEternity.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

// eslint-disable-next-line max-params
export function addEternityTime(time, realTime, ep, eternities) {
  let challenge = "";
  if (player.challenge.eternity.current) {
    const currEC = player.challenge.eternity.current;
    const ec = EternityChallenge(currEC);
    const challText = player.dilation.active ? "Dilated EC" : "Eternity Challenge";
    challenge = `${challText} ${currEC} (${formatInt(ec.completions)}/${formatInt(ec.maxCompletions)})`;
  } else if (player.dilation.active) challenge = "Time Dilation";
  // If we call this function outside of dilation, it uses the existing AM and produces an erroneous number
  const gainedTP = player.dilation.active ? getTachyonGain() : DC.D0;
  player.records.recentEternities.pop();
  player.records.recentEternities.unshift([time, realTime, ep, eternities, challenge, gainedTP]);
  GameCache.averageRealTimePerEternity.invalidate();
}

export function resetEternityRuns() {
  player.records.recentEternities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]
  );
  GameCache.averageRealTimePerEternity.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
export function getEternitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.eternity.autoEternitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisReality.bestEternitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

function isOfflineEPGainEnabled() {
  return player.options.offlineProgress && !Autobuyer.bigCrunch.autoInfinitiesAvailable() &&
    !Autobuyer.eternity.autoEternitiesAvailable();
}

export function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached || !isOfflineEPGainEnabled()) return DC.D0;
  return player.records.bestEternity.bestEPminReality.times(TimeSpan.fromMilliseconds(ms).totalMinutes.div(4));
}

// Note: realities and ampFactor must be distinct because there are a few things farther up which only multiply
// reality count and none of the other things
// eslint-disable-next-line max-params
export function addRealityTime(time, realTime, rm, level, realities, ampFactor, projIM) {
  let reality = [];
  const celestials = [Teresa, Effarig, Enslaved, V, Ra, Laitela, Glitch];
  for (const cel of celestials) {
    if (cel.isRunning) reality.push(cel.displayName);
  }
  const shards = Effarig.shardsGained;
  player.records.recentRealities.pop();
  player.records.recentRealities.unshift([time, realTime, rm.times(ampFactor),
    realities, makeEnumeration(reality), level, shards.mul(ampFactor), projIM]);
}


export function gainedInfinities() {
  if (EternityChallenge(4).isRunning || Pelle.isDisabled("InfinitiedMults")) {
    return DC.D1;
  }
  let infGain = Effects.max(
    1,
    Achievement(87)
  ).toDecimal();

  infGain = infGain.timesEffectsOf(
    TimeStudy(32),
    RealityUpgrade(5),
    RealityUpgrade(7),
    Achievement(131).effects.infinitiesGain,
    Achievement(164),
    Ra.unlocks.continuousTTBoost.effects.infinity
  );
  infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
  infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
  return infGain;
}

export function updateRefresh() {
  GameStorage.save();
  location.reload(true);
}

export const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  SINGULARITY_MILESTONE: 5,
  NERFS: 6
};

/**
  * @param {number[]?} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number?} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation. This is only used during offline black hole stuff.
  */
export function getGameSpeedupFactor(effectsToConsider, blackHolesActiveOverride) {
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED)) {
    if (EternityChallenge(12).isRunning) {
      return new Decimal(0.001);
    }
  }

  let factor = new Decimal(1);
  if (effects.includes(GAME_SPEED_EFFECT.BLACK_HOLE)) {
    if (BlackHoles.areNegative) {
      factor = factor.mul(player.blackHoleNegative);
    } else if (!BlackHoles.arePaused) {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor = factor.mul(Decimal.pow(blackHole.power, BlackHoles.unpauseAccelerationFactor));
        factor = factor.mul(VUnlocks.achievementBH.effectOrDefault(1));
      }
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.SINGULARITY_MILESTONE)) {
    factor = factor.mul(SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1));
  }

  if (effects.includes(GAME_SPEED_EFFECT.TIME_GLYPH)) {
    factor = factor.mul(getAdjustedGlyphEffect("timespeed"));
    factor = Decimal.pow(factor, getAdjustedGlyphEffect("effarigblackhole"));
  }

  factor = factor.mul(GlitchRifts.alpha.milestones[2].effectOrDefault(1));
  factor = factor.pow(VUnlocks.gamespeedPower.effectOrDefault(1));
  factor = factor.pow(MetaFabricatorUpgrades.all[2].effectOrDefault(1)); 

  
  if (Enslaved.isStoringGameTime && effects.includes(GAME_SPEED_EFFECT.TIME_STORAGE)) {
    const storedTimeWeight = Ra.unlocks.autoPulseTime.canBeApplied ? 0.99 : 1;
    factor = factor.mul(1 - storedTimeWeight).add(storedTimeWeight);
  }

  // These effects should always be active, but need to be disabled during offline black hole simulations because
  // otherwise it gets applied twice
  if (effects.includes(GAME_SPEED_EFFECT.NERFS)) {
    if (Effarig.isRunning) {
      if(factor.gt(1)) factor = Effarig.multiplier(factor);
    }
    if (Laitela.isRunning && !GlitchRealityUpgrades.all[7].isBought) {
      const nerfModifier = Math.clampMax(Time.thisRealityRealTime.totalMinutes.div(10).toNumber(), 1);
      factor = Decimal.pow(factor, nerfModifier);
    }
  }


  factor = factor.mul(PelleUpgrade.timeSpeedMult.effectValue);

  // 1e-300 is now possible with max inverted BH, going below it would be possible with
  // an effarig glyph.
 if(player.records.fullGameCompletions == 0) factor = Decimal.max(factor, 1e-300);

  return factor;
}

export function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (
    Enslaved.isAutoReleasing &&
    Enslaved.canRelease(true) &&
    !BlackHoles.areNegative &&
    !Pelle.isDisabled("blackhole")
  ) {
    return Decimal.max(Enslaved.autoReleaseSpeed, speedFactor);
  }
  return speedFactor;
}

// Separated out for organization; however this is also used in more than one spot in gameLoop() as well. Returns
// true if the rest of the game loop should be skipped
export function realTimeMechanics(realDiff) {
  player.IAP.STDcoins += realDiff / (1000 * 150);

  Currency.riftForce.add(Glitch.riftForceGain.div(1000 / realDiff));

  if(MetaFabricatorUpgrade(8).isBought && !Pelle.isDoomed) player.celestials.teresa.bestRunAM = player.celestials.teresa.bestRunAM.max(Currency.antimatter.value);
  
  player.celestials.v.metaTheorems = Math.min(player.celestials.v.metaTheorems + MetaFabricatorUpgrade(20).effectOrDefault(DC.D0).div(1000 / realDiff).toNumber(), 25000);
  V.updateTotalRunUnlocks();

  // Ra memory generation bypasses stored real time, but memory chunk generation is disabled when storing real time.
  // This is in order to prevent players from using time inside of Ra's reality for amplification as well
  Ra.memoryTick(realDiff, !Enslaved.isStoringRealTime);
  if (AlchemyResource.momentum.isUnlocked) {
    player.celestials.ra.momentumTime += realDiff * Achievement(175).effectOrDefault(1);
  }

  if (MetaFabricatorUpgrade(17).isBought){
    AlchemyResource.all.forEach(a => a.amount = Ra.alchemyResourceCap);
  }
  else if(Ra.unlocks.PassiveAlc.isEffectActive)
  {
    Ra.applyAlchemyReactions(realDiff);
  }
  
  DarkMatterDimensions.tick(realDiff);

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime || realityUGs.all[7].isBought) {
    if(Enslaved.isStoringRealTime){
    player.records.realTimePlayed += realDiff;
    player.records.thisInfinity.realTime += realDiff;
    player.records.thisEternity.realTime += realDiff;
    player.records.thisReality.realTime += realDiff;
    player.records.thisMeta.realTime += realDiff;
    }
    Enslaved.storeRealTime();
    // Most autobuyers will only tick usefully on the very first tick, but this needs to be here in order to allow
    // the autobuyers unaffected by time storage to tick as well
    Autobuyers.tick();
    GameUI.update();
    if(realityUGs.all[7].isBought) return false;
    return true
  }
  return false;
}

// "passDiff" is in ms. It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called (capped at a day). This is on average
// equal to the update rate, but may be much larger if the game was unfocused or the device went to sleep for some time.
// eslint-disable-next-line complexity
export function gameLoop(passDiff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");

  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  
  // In certain cases we want to allow the player to interact with the game's settings and tabs, but prevent any actual
  // resource generation from happening - in these cases, we have to make sure this all comes before the hibernation
  // check or else it'll attempt to run the game anyway
  if (Speedrun.isPausedAtStart() || GameEnd.creditsEverClosed) {
    GameUI.update();
    return;
  }

  let diff = passDiff;
  const thisUpdate = Date.now();
  const realDiff = diff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7)
    : diff;
  if (!GameStorage.ignoreBackupTimer) player.backupTimer += realDiff;

  // For single ticks longer than a minute from the GameInterval loop, we assume that the device has gone to sleep or
  // hibernation - in those cases we stop the interval and simulate time instead. The gameLoop interval automatically
  // restarts itself at the end of the simulateTime call. This will not trigger for an unfocused game, as this seems to
  // result in a ~1 second tick rate for browsers.
  // Note that we have to explicitly call all the real-time mechanics with the existing value of realDiff, because
  // simply letting it run through simulateTime seems to result in it using zero
  if (player.options.hibernationCatchup && passDiff === undefined && realDiff > 6e4) {
    GameIntervals.gameLoop.stop();
    simulateTime(realDiff / 1000, true);
    realTimeMechanics(realDiff);
    return;
  }

  // Run all the functions which only depend on real time and not game time, skipping the rest of the loop if needed
  if (realTimeMechanics(realDiff)) return;

  // Ra-Nameless auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing) {
    Enslaved.autoReleaseTick++;
  }
  if (Enslaved.autoReleaseTick >= 5) {
    Enslaved.autoReleaseTick = 0;
    Enslaved.useStoredTime(true);
    Enslaved.isReleaseTick = true;
  } else if (!Enslaved.isReleaseTick) {
    Enslaved.nextTickDiff = realDiff;
  }
  if (diff === undefined) {
    diff = Enslaved.nextTickDiff;
  }

  Autobuyers.tick();
  Tutorial.tutorialLoop();

  if (Achievement(165).isUnlocked && player.celestials.effarig.autoAdjustGlyphWeights) {
    autoAdjustGlyphWeights();
  }

  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.antimatterDimensionCommonMultiplier.invalidate();
  GameCache.antimatterDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();
  
  const blackHoleDiff = realDiff;
  const fixedSpeedActive = EternityChallenge(12).isRunning;
  if (!Enslaved.isReleaseTick && !fixedSpeedActive) {
    let speedFactor;
    if (options.blackHoleSpeedup === undefined) {
      speedFactor = getGameSpeedupFactor();
    } else {
      // This is only called from simulateTime() and is calculated externally in order to avoid weirdness when game
      // speed is directly nerfed
      speedFactor = options.blackHoleSpeedup;
    }

    if (Enslaved.isStoringGameTime && !fixedSpeedActive) {
      // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
      const reducedTimeFactor = getGameSpeedupFactor();
      const totalTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH,
        GAME_SPEED_EFFECT.BLACK_HOLE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE]);
      const amplification = Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1);
      const beforeStore = player.celestials.enslaved.stored;
      player.celestials.enslaved.stored = player.celestials.enslaved.stored.add(
        (totalTimeFactor.sub(reducedTimeFactor)).mul(amplification).mul(diff));
      Enslaved.currentBlackHoleStoreAmountPerMs = player.celestials.enslaved.stored.sub(beforeStore).div(diff);
      speedFactor = reducedTimeFactor;
    }
    diff = speedFactor.mul(diff);
  } else if (fixedSpeedActive) {
    diff = getGameSpeedupFactor().mul(diff);
    Enslaved.currentBlackHoleStoreAmountPerMs = 0;
  }
  player.celestials.ra.peakGamespeed = Decimal.max(player.celestials.ra.peakGamespeed, getGameSpeedupFactor());
  Enslaved.isReleaseTick = false;

  diff = new Decimal(diff);
  // These need to all be done consecutively in order to minimize the chance of a reset occurring between real time
  // updating and game time updating. This is only particularly noticeable when game speed is 1 and the player
  // expects to see identical numbers. We also don't increment the timers if the game has been beaten (Achievement 188)
  if ( GameEnd.additionalEnd < END_STATE_MARKERS.FADE_AWAY ) {
    player.records.realTimeDoomed += realDiff;
    player.records.realTimePlayed += realDiff;
    player.records.totalTimePlayed = player.records.totalTimePlayed.add(diff);
    player.records.thisInfinity.realTime += realDiff;
    player.records.thisInfinity.time = player.records.thisInfinity.time.add(diff);
    player.records.thisEternity.realTime += realDiff;
    if (Enslaved.isRunning && Enslaved.feltEternity && !EternityChallenge(12).isRunning) {
      player.records.thisEternity.time = player.records.thisEternity.time.add(Currency.eternities.value.clampMax((player.records.fullGameCompletions > 0) ? "1e308" : "1e66").add(1).mul(diff));
    } else {
      player.records.thisEternity.time = player.records.thisEternity.time.add(diff);
    }
    player.records.thisReality.realTime += realDiff;
    player.records.thisReality.time = player.records.thisReality.time.add(diff);

    player.records.thisMeta.realTime += realDiff;
    player.records.thisMeta.time = player.records.thisMeta.time.add(diff);
  }

  DeltaTimeState.update(realDiff, diff);

  updateNormalAndInfinityChallenges(diff);

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  preProductionGenerateIP(diff);

  if (!Pelle.isDoomed || MetaFabricatorUpgrade(7)) {
    passivePrestigeGen();
  }

  applyAutoprestige(realDiff);
  updateImaginaryMachines(realDiff);

  const uncountabilityGain = AlchemyResource.uncountability.effectValue * Time.unscaledDeltaTime.totalSeconds.toNumber();
  Currency.realities.add(uncountabilityGain);
  Currency.perkPoints.add(uncountabilityGain * GlitchRifts.gamma.milestones[1].effectOrDefault(1));

  if (Perk.autocompleteEC1.canBeApplied) player.reality.lastAutoEC = player.reality.lastAutoEC.add(realDiff);

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  AntimatterDimensions.tick(diff);
  ChaosDimensions.tick(new Decimal(realDiff));

  const gain = Math.clampMin(FreeTickspeed.fromShards(Currency.timeShards.value).newAmount - player.totalTickGained, 0);
  player.totalTickGained += gain;

  updatePrestigeRates();
  tryCompleteInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  replicantiLoop(diff);

  if (PlayerProgress.dilationUnlocked()) {
    Currency.dilatedTime.add(getDilationGainPerSecond().times( diff.div(1000) ));
  }

  updateTachyonGalaxies();
  Currency.timeTheorems.add(getTTPerSecond().times(diff.div(1000)));
  InfinityDimensions.tryAutoUnlock();

  BlackHoles.updatePhases(blackHoleDiff);

  // Unlocks dilation at a certain total TT count for free, but we add the cost first in order to make
  // sure that TT count doesn't go negative and that we can actually buy it. This technically bumps the max theorem
  // amount up as well, but at this point of the game 5k TT is insignificant to basically all other sources of TT.
  if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
    Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement) &&
    !isInCelestialReality() &&
    !Pelle.isDoomed) {
    Currency.timeTheorems.add(TimeStudy.dilation.cost);
    TimeStudy.dilation.purchase(true);
  }

  applyAutoUnlockPerks();
  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  // There are some external checks which prevent excessive resource gain with Teresa-25; it may give TP outside of
  // dilation, but the TP gain function is also coded to behave differently if it's active
  const teresa1 = player.dilation.active && Ra.unlocks.autoTP.canBeApplied;
  const teresa25 = !isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied;
  if ((teresa1 || teresa25) && !Pelle.isDoomed) rewardTP();

  if (Enslaved.canTickHintTimer) {
    player.celestials.enslaved.hintUnlockProgress += Enslaved.isRunning ? realDiff : (realDiff * 0.4);
    if (player.celestials.enslaved.hintUnlockProgress >= TimeSpan.fromHours(5).totalMilliseconds.toNumber()) {
      EnslavedProgress.hintsUnlocked.giveProgress();
      Enslaved.quotes.hintUnlock.show();
    }
  }

  laitelaRealityTick(realDiff);
  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  AutomatorBackend.update(realDiff);
  Pelle.gameLoop(realDiff);
  GalaxyGenerator.loop(realDiff);
  GameEnd.gameLoop(realDiff);

  player.antimatter = new Decimal(player.antimatter); // i have no idea what is making this reactive :(

  if (!Enslaved.canAmplify) {
    Enslaved.boostReality = false;
  }

  // Stopping these checks after CREDITS_START reduces lag and allows for the glyph customization modal to appear
  if (GameEnd.endState < END_STATE_MARKERS.CREDITS_START) {
    if (Tabs.current.isPermanentlyHidden) {
      const tab = Tabs.all.reverse().find(t => !t.isPermanentlyHidden && t.id !== 10);
      if (tab) tab.show(true);
      else [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }

    if (Tabs.current.subtabs.find(t => t.isOpen).isPermanentlyHidden) {
      [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }
  }

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

function updatePrestigeRates() {
  const currentIPmin = gainedInfinityPoints().dividedBy(Decimal.clampMin(0.0005, Time.thisInfinityRealTime.totalMinutes));
  if (currentIPmin.gt(player.records.thisInfinity.bestIPmin) && Player.canCrunch) {
    player.records.thisInfinity.bestIPmin = currentIPmin;
    player.records.thisInfinity.bestIPminVal = gainedInfinityPoints();
  }

  const currentEPmin = gainedEternityPoints().dividedBy(Decimal.clampMin(0.0005, Time.thisEternityRealTime.totalMinutes));
  if (currentEPmin.gt(player.records.thisEternity.bestEPmin) && Player.canEternity) {
    player.records.thisEternity.bestEPmin = currentEPmin;
    player.records.thisEternity.bestEPminVal = gainedEternityPoints();
  }

  const currentRSmin = Effarig.shardsGained.div(Decimal.clampMin(0.0005, Time.thisRealityRealTime.totalMinutes));
  if (currentRSmin.gt(player.records.thisReality.bestRSmin) && isRealityAvailable() ) {
    player.records.thisReality.bestRSmin = currentRSmin;
    player.records.thisReality.bestRSminVal = Effarig.shardsGained;
  }
}

function passivePrestigeGen() {
  let eternitiedGain = 0;
  if (MetaFabricatorUpgrade(7).isBought || (RealityUpgrade(14).isBought && !Glitch.isRunning) || (EffarigUnlock.eternity.isUnlocked && !Glitch.isRunning)) {
    eternitiedGain = DC.D1.timesEffectsOf(
      Achievement(113),
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain = Decimal.times(eternitiedGain, getAdjustedGlyphEffect("timeetermult"));
    eternitiedGain = new Decimal(Time.deltaTime).times(
      Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue));
    if(Pelle.isDoomed) eternitiedGain = DC.D1;
    player.reality.partEternitied = player.reality.partEternitied.plus(eternitiedGain);
    Currency.eternities.add(player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  if (!EternityChallenge(4).isRunning && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
    let infGen = DC.D0;
    if (BreakInfinityUpgrade.infinitiedGen.isBought) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      infGen = infGen.plus(Time.deltaTimeMs.div(Decimal.clampMin(50, player.records.bestInfinity.time)).mul(0.5));
      infGen = infGen.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infGen = infGen.times(getAdjustedGlyphEffect("infinityinfmult"));
    }
    if (RealityUpgrade(11).isBought && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
      infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
    }
    if (EffarigUnlock.eternity.isUnlocked && (!Glitch.isRunning || MetaFabricatorUpgrade(7).isBought)) {
      // We consider half of the eternities we gained above this tick
      // to have been gained before the infinities, and thus not to
      // count here. This gives us the desirable behavior that
      // infinities and eternities gained overall will be the same
      // for two ticks as for one tick of twice the length.
      infGen = infGen.plus(gainedInfinities().times(
        Currency.eternities.value.minus(eternitiedGain.div(2).floor())).add(1).times(Time.deltaTime));
    }
    if(Pelle.isDoomed && MetaFabricatorUpgrade(7).isBought) infGen = DC.D1;

    infGen = infGen.plus(player.partInfinitied);
    Currency.infinities.add(infGen.floor());
    player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
  }
}

// Applies all perks which automatically unlock things when passing certain thresholds, needs to be checked every tick
function applyAutoUnlockPerks() {
  if (!TimeDimension(8).isUnlocked && Perk.autounlockTD.canBeApplied) {
    for (let dim = 5; dim <= 8; ++dim) TimeStudy.timeDimension(dim).purchase();
  }
  if (Perk.autounlockDilation3.canBeApplied) buyDilationUpgrade(DilationUpgrade.ttGenerator.id);
  if (Perk.autounlockReality.canBeApplied) TimeStudy.reality.purchase(true);
  applyEU2();
}

function laitelaRealityTick(realDiff) {
  
  const laitelaInfo = player.celestials.laitela;
  if (!Laitela.isRunning) return;
  if (laitelaInfo.entropy >= 0) {
    laitelaInfo.entropy += (realDiff / 1000) * Laitela.entropyGainPerSecond;
  }

  // Setting entropy to -1 on completion prevents the modal from showing up repeatedly
  if (laitelaInfo.entropy >= 1) {
    let completionText = `Lai'tela's Reality has been destabilized after ${Time.thisRealityRealTime.toStringShort()}.`;
    laitelaInfo.entropy = -1;
    const oldInfo = {
      fastestCompletion: laitelaInfo.fastestCompletion,
      difficultyTier: laitelaInfo.difficultyTier,
      realityReward: Laitela.realityReward
    };
    laitelaInfo.thisCompletion = Time.thisRealityRealTime.totalSeconds;
    laitelaInfo.fastestCompletion = Decimal.min(laitelaInfo.thisCompletion, laitelaInfo.fastestCompletion);
    clearCelestialRuns();
    if (Time.thisRealityRealTime.totalSeconds.lt(30)) {
      laitelaInfo.difficultyTier++;
      laitelaInfo.fastestCompletion = new Decimal(300);
      completionText += laitelaBeatText(Laitela.maxAllowedDimension + 1);
      for (const quote of Laitela.quotes.all) {
        if (quote.requirement) {
          quote.show();
        }
      }
    }
    if (Laitela.realityReward > oldInfo.realityReward) {
      completionText += `<br><br>Dark Matter Multiplier: ${formatX(oldInfo.realityReward, 2, 2)}
      ➜ ${formatX(Laitela.realityReward, 2, 2)}`;
      if (oldInfo.fastestCompletion.eq(3600) || oldInfo.fastestCompletion.eq(300) && oldInfo.difficultyTier > 0) {
        if (Time.thisRealityRealTime.totalSeconds.lt(30)) {
          // First attempt - destabilizing
          completionText += `<br>Best Completion Time: None ➜ Destabilized
          <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)} ➜
          ${formatInt(8 - laitelaInfo.difficultyTier)}`;
        } else {
          // First attempt - not destabilizing
          completionText += `<br>Best Completion Time: None ➜
            ${TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()}
            <br>Highest Active Dimension: ${formatInt(8 - laitelaInfo.difficultyTier)}`;
        }
      } else if (Time.thisRealityRealTime.totalSeconds.lt(30)) {
        // Second+ attempt - destabilizing
        completionText += `<br>Best Completion Time: ${TimeSpan.fromSeconds(oldInfo.fastestCompletion).toStringShort()}
          ➜ Destabilized
          <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)} ➜
          ${formatInt(8 - laitelaInfo.difficultyTier)}`;
      } else {
        // Second+ attempt - not destabilizing
        completionText += `<br>Best Completion Time: ${TimeSpan.fromSeconds(oldInfo.fastestCompletion).toStringShort()}
        ➜ ${TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()}
        <br>Highest Active Dimension: ${formatInt(8 - oldInfo.difficultyTier)}`;
      }
      player.records.bestReality.laitelaSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    } else {
      completionText += ` You need to destabilize in faster than
        ${TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()} to improve your multiplier.`;
    }
    if (Laitela.isFullyDestabilized) SpeedrunMilestones(24).tryComplete();
    Modal.message.show(completionText, {}, 2);
  }
}

function laitelaBeatText(disabledDim) {
  switch (disabledDim) {
    case 1: return `<br><br>Lai'tela's Reality will now completely disable production from all Dimensions.
        The Reality can still be entered, but further destabilization is no longer possible.
        For completely destabilizing the Reality, you also get an additional ${formatX(8)} to Dark Energy gain.`;
    case 2: return `<br><br>Lai'tela's Reality will now disable production from all 2nd Dimensions during
      future runs, but the reward will be ${formatInt(100)} times stronger than before. Completely destabilizing
      the Reality for the final Dimension will give you an additional ${formatX(8)} to Dark Energy gain.`;
    case 3: return `<br><br>Lai'tela's Reality will now disable production from all 3rd Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before.`;
    case 8: return `<br><br>Lai'tela's Reality will now disable production from all 8th Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before. This boost can be
        repeated for each remaining Dimension by reaching destabilization within ${formatInt(30)} seconds again.`;
    default: return `<br><br>Lai'tela's Reality will now disable production from all
        ${disabledDim}th Dimensions during future runs, but the reward will be
        ${formatInt(100)} times stronger than before.`;
  }
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
function applyAutoprestige(diff) {
  Currency.infinityPoints.add(MetaFabricatorUpgrade(7).isBought ? TimeStudy(181).effectValue : TimeStudy(181).effectOrDefault(0));

  if (TeresaUnlocks.epGen.canBeApplied || MetaFabricatorUpgrade(7).isBought) {
    Currency.eternityPoints.add(player.records.thisEternity.bestEPmin.times(MetaFabricatorUpgrade(7).isBought ? 1 : DC.D0_01)
      .times(getGameSpeedupFactor().mul(Decimal.div(diff, 1000))).timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige));
  }

  if (InfinityUpgrade.ipGen.isCharged || MetaFabricatorUpgrade(7).isBought) {
    const addedRM = MachineHandler.gainedRealityMachines
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff / 1000);
    Currency.realityMachines.add(addedRM);
  }

  if (PelleRifts.chaos.milestones[2].canBeApplied) {
    Currency.eternityPoints.add(gainedEternityPoints().times(DC.D0_1).times(diff / 1000));
  }
}

function updateImaginaryMachines(diff) {
  MachineHandler.updateIMCap();
  Currency.imaginaryMachines.add(MachineHandler.gainedImaginaryMachines(diff));
}

function updateTachyonGalaxies() {
  const tachyonGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies);
  const tachyonGalaxyThreshold = 1000;
  const thresholdMult = getTachyonGalaxyMult();

    player.dilation.baseTachyonGalaxies = Math.max(player.dilation.baseTachyonGalaxies,
      1 + Math.floor(Decimal.log(Currency.dilatedTime.value.dividedBy(1000), thresholdMult)));
    player.dilation.nextThreshold = DC.E3.times(new Decimal(thresholdMult)
      .pow(player.dilation.baseTachyonGalaxies));
    
    player.dilation.totalTachyonGalaxies =
    (Math.min(player.dilation.baseTachyonGalaxies * tachyonGalaxyMult, tachyonGalaxyThreshold) +
    Math.max(player.dilation.baseTachyonGalaxies * tachyonGalaxyMult - tachyonGalaxyThreshold, 0) / tachyonGalaxyMult);

    let a = player.dilation.totalTachyonGalaxies * DilationUpgrade.galaxyMultiplier.effectValue;
    if(a > 500000) a = a / ((a/500000) ** 0.8);

    player.dilation.totalTachyonGalaxies = a;
}

export function getTTPerSecond() {
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = Effects.product(
    Ra.unlocks.continuousTTBoost.effects.ttGen,
    Ra.unlocks.achievementTTMult,
    Achievement(137),
    Achievement(156),
  );
  if (GlyphAlteration.isAdded("dilation")) ttMult *= getSecondaryGlyphEffect("dilationTTgen");

  // Glyph TT generation
  const glyphTT = Teresa.isRunning || Enslaved.isRunning || Glitch.isRunning || Pelle.isDoomed
    ? 0
    : getAdjustedGlyphEffect("dilationTTgen") * ttMult;

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(Pelle.isDoomed ? 1 : ttMult)
    : DC.D0;

  // Lai'tela TT power
  let finalTT = dilationTT.add(glyphTT);
  if (finalTT.gt(1)) {
    finalTT = finalTT.pow(SingularityMilestone.theoremPowerFromSingularities.effectOrDefault(1));
  }

  return finalTT;
}

// eslint-disable-next-line no-unused-vars
function recursiveTimeOut(fn, iterations, endFn) {
  fn(iterations);
  if (iterations === 0) endFn();
  else setTimeout(() => recursiveTimeOut(fn, iterations - 1, endFn), 0);
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }

  GameUI.notify.showBlackHoles = true;
}

export function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds < 0) return;
  let ticks = Math.floor(seconds * 20);
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  const maxTicks = GameStorage.maxOfflineTicks(1000 * seconds, GameStorage.offlineTicks ?? player.options.offlineTicks);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && !real && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  let totalGameTime;

  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    totalGameTime = BlackHoles.calculateGameTimeFromRealTime(seconds, BlackHoles.calculateSpeedups());
  } else {
    totalGameTime = getGameSpeedupFactor().mul(seconds);
  }

  const infinitiedMilestone = getInfinitiedMilestoneReward(totalGameTime.mul(1000));
  const eternitiedMilestone = getEternitiedMilestoneReward(totalGameTime.mul(1000));

  if (eternitiedMilestone.gt(0)) {
    Currency.eternities.add(eternitiedMilestone);
  } else if (infinitiedMilestone.gt(0)) {
    Currency.infinities.add(infinitiedMilestone);
  } else {
    Currency.eternityPoints.add(getOfflineEPGain(seconds * 1000));
  }

  if (InfinityUpgrade.ipOffline.isBought && player.options.offlineProgress) {
    Currency.infinityPoints.add(player.records.thisEternity.bestIPMsWithoutMaxAll.times(seconds * 500));
  }

  EventHub.dispatch(GAME_EVENT.OFFLINE_CURRENCY_GAINED);

  let remainingRealSeconds = seconds;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  let loopFn = i => {
    const diff = remainingRealSeconds / i;
    gameLoop(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // Simulation code which accounts for BH cycles (segments where a BH is active doesn't use diff since it splits
  // up intervals based on real time instead in an effort to keep ticks all roughly equal in game time).
  // Black hole auto-pausing is entirely handled by the black hole phase advancement code (for actually pausing)
  // and calculateOfflineTick (for time calculation).
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    loopFn = i => {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        i, 0.0001);
      remainingRealSeconds -= realTickTime;
      gameLoop(1000 * realTickTime, { blackHoleSpeedup });
    };
  }

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameIntervals.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "Offline Progress Simulation",
            info: () => `The game is being run at a lower accuracy in order to quickly calculate the resources you
              gained while you were away. See the How To Play entry on "Offline Progress" for technical details. If
              you are impatient and want to get back to the game sooner, you can click the "Speed up" button to
              simulate the rest of the time with half as many ticks (down to a minimum of ${formatInt(500)} ticks
              remaining). The "SKIP" button will instead use all the remaining offline time in ${formatInt(10)}
              ticks.`,
            progressName: "Ticks",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: "Speed up",
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: "SKIP",
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

window.onload = function() {
  DecimalChanges();
  
  const supportedBrowser = browserCheck();
  GameUI.initialized = supportedBrowser;
  ui.view.initialized = supportedBrowser;
  setTimeout(() => {
    ElectronRuntime.updateZoom();
    document.getElementById("loading").style.display = "none";
  }, 500);
  if (!supportedBrowser) {
    GameIntervals.stop();
    document.getElementById("loading").style.display = "none";
    document.getElementById("browser-warning").style.display = "flex";
  }
};

window.onfocus = function() {
  setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

export function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

export function setHoldingR(x) {
  Replicanti.galaxies.isPlayerHoldingR = x;
}

export function browserCheck() {
  return supportedBrowsers.test(navigator.userAgent);
}

export function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Reality Update 🌌");
  if (DEV) {
    // eslint-disable-next-line no-console
    console.log("👨‍💻 Development Mode 👩‍💻");
  }
  ElectronRuntime.initialize();
  SteamRuntime.initialize();
  Cloud.init();
  GameStorage.load();
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab).show(true);
  Payments.init();

  // funny title
  document.title = "Antimatter Dimensions: " + titles[randomInt(0,titles.length++)];
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = time - lastFrame;
  lastFrame = time;
  if (player.dilation.active) {
    delta /= Pelle.isDoomed ? 1.5 : 10;
  }
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

function DecimalChanges(){
    Decimal.MAX_VALUE.e = 1e300;
    Decimal.MIN_VALUE.e = -1e300;
    
    Decimal.prototype.fromString = function(t) {
        if(t === "") {this.m=0; this.e=0; return this;}
        if (-1 !== t.indexOf("e")) {
            var n = t.split("e");
            this.m = parseFloat(n[0]),
            this.e = parseFloat(n[1]),
            this.normalize()
        } else if ("NaN" === t)
            this.m = Number.NaN,
            this.e = Number.NaN;
        else if (this.fromNumber(parseFloat(t)),
        isNaN(this.m))
            throw Error("[DecimalError] Invalid argument: " + t);
        return this
    }

}

animateTweens();

function randomInt(min = 0, max = 10) {return Math.floor(min + (Math.random() * (max - min)))};

var titles = ["Help me", "Now with upgrades", "The Antimatter update", "Uhhh, I think I broke something", "No don't do that", "Now with a 9th dimension",
              "THERE'S NEW CONTENT?!?!?!", "Also try minecraft", "You know what that means FISHHHHH", "Now with dimensions", "THE NEWS IS NOT FAKE", "Now's you chance to make [ANTIMATTER]",
              "That's bananas", "update in 5 hours", "Hevipelle is good at using GitHub :)", "The update that makes the game bad", " I'm poor now :(", "Nerf the galaxies plz",
              "Get more antimatter", "Can give me more galaxies please?", "NG+infinite", "How do I cheat", "When do the memes get added?", "How much is infinity?",
              "Never gonna give you up", "Hexa you need to slow down with all your mods!", "Stop looking at me", "Who is \"Royal\"?", "Join the Discord"];
