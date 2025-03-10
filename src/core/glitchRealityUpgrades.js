import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";

const E50 = new Decimal(1e50);


class GlitchRealityUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get automatorPoints() {
    return this.config.automatorPoints ? this.config.automatorPoints : 0;
  }

  get name() {
    return typeof this.config.name == "function" ? this.config.name() : this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.riftForce;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.celestials.glitch.upgrades.broughtbits;
  }

  set bits(value) {
    player.celestials.glitch.upgrades.broughtbits = value;
  }

  get isAvailableForPurchase() {
    return (player.celestials.glitch.upgrades.unlockbits & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  onPurchased() {
    if(this.id == 16) Glitch.quotes.glitchFinishPowerUGs.show();
  }

  tryUnlock() {
    if ( this.isAvailableForPurchase  || !this.config.checkRequirement()) return;
    player.celestials.glitch.upgrades.unlockbits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked ${this.name} from Glitch's Reality`, 5000);
  }
  
}

class RebuyableGlitchRealityUpgradeState extends RebuyableMechanicState {
  constructor(config){
    super(config)
    this._infinityAmount = findFirstInfiniteCostPurchase(1e50, this.config.initialCost.toNumber(), this.config.costMult.toNumber(), this.config.costMult.toNumber() / 10 );
  }

  get currency() {
    return Currency.riftForce;
  }

  get boughtAmount() {
    return player.celestials.glitch.upgrades.rebuyable[this.id];
  }

  set boughtAmount(value) {
    player.celestials.glitch.upgrades.rebuyable[this.id] = value;
  }

  get name() {
    return typeof this.config.name == "function" ? this.config.name() : this.config.name;
  }
  
  purchaseHybrid(){
    if(this.currency.lt('e310')){
      const amount = E50.div(this.config.initialCost).log(this.config.costMult).add(1).floor();
      if(amount.gt(this.boughtAmount)) {
        const cost = this.config.hybridCostScaling(amount);
        if(this.currency.gt(cost)) {
          this.boughtAmount = amount;
        }
      }
      if(this.boughtAmount.lt(this._infinityAmount)) {
        const infinityCost = this.config.hybridCostScaling(amount);
        if(this.currency.gt(infinityCost)) {
          this.boughtAmount = new Decimal(this._infinityAmount);
        }
      }
    }

    const expoCost = new ExponentialCostScaling({
        baseCost: new Decimal('e309'),
        baseIncrease: new Decimal(3),
        costScale: this.config.initialCost.times(this.config.costMult),
        scalingCostThreshold: Decimal.NUMBER_MAX_VALUE
      });
    const amo = expoCost.getMaxBought(new Decimal(0), this.currency.value, 1)
    if(amo != null) this.boughtAmount = amo.quantity.add(this._infinityAmount);

  }

}

GlitchRealityUpgradeState.index = mapGameData(
  GameDatabase.celestials.glitchRealityUpgrades,
  config => (config.id < 5
    ? new RebuyableGlitchRealityUpgradeState(config)
    : new GlitchRealityUpgradeState(config))
);

/**
 * @param {number} id
 * @return {RealityUpgradeState|RebuyableRealityUpgradeState}
 */
export const GlitchRealityUpgrade = id => GlitchRealityUpgradeState.index[id];

export const GlitchRealityUpgrades = {
  /**
   * @type {(RealityUpgradeState|RebuyableRealityUpgradeState)[]}
   */
  all: GlitchRealityUpgradeState.index.compact(),
  get allBought() {
    return (player.celestials.glitch.upgrades.broughtbits >> 6) + 1 === 1 << (GameDatabase.celestials.glitchRealityUpgrades - 4);
  }
};



class GlitchSpeedUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get automatorPoints() {
    return this.config.automatorPoints ? this.config.automatorPoints : 0;
  }

  get name() {
    return typeof this.config.name == "function" ? this.config.name() : this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.riftForce;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.celestials.glitch.upgrades.speedbroughtbits;
  }

  set bits(value) {
    player.celestials.glitch.upgrades.speedbroughtbits = value;
  }

  get isAvailableForPurchase() {
    return (player.celestials.glitch.upgrades.speedunlockbits & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  onPurchased() {
    if(this.id == 4) Glitch.quotes.glitchBuySpeed4.show()
  }

  tryUnlock() {
    if ( this.isAvailableForPurchase  || !this.config.checkRequirement() || player.records.fullGameCompletions == 0) return;
    player.celestials.glitch.upgrades.speedunlockbits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked ${this.name} from Glitch's Speedy Reality`, 5000);
  }
  
}

GlitchSpeedUpgradeState.index = mapGameData(
  GameDatabase.celestials.glitchSpeedUpgrades,
  config => new GlitchSpeedUpgradeState(config)
);

/**
 * @param {number} id
 * @return {RealityUpgradeState|RebuyableRealityUpgradeState}
 */
export const GlitchSpeedUpgrade = id => GlitchSpeedUpgradeState.index[id];

export const GlitchSpeedUpgrades = {
  /**
   * @type {(RealityUpgradeState|RebuyableRealityUpgradeState)[]}
   */
  all: GlitchSpeedUpgradeState.index.compact(),
  get allBought() {
    return (player.celestials.glitch.upgrades.speedbroughtbits >> 6) + 1 === 1 << (GameDatabase.celestials.glitchSpeedUpgrades );
  }
};

