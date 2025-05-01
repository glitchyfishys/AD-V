import { DimensionState } from "../../dimensions/dimension";
import { DC } from "../../constants";

class NullCycleState extends DimensionState {
  constructor(tier) {
    super(() => player.celestials.null.cycle, tier);
    this._baseCost = new Decimal(10).pow(tier ** 1.5);
    this._baseCostMultiplier = new Decimal(10).pow(tier ** 1.75);
  }

  /**
   * @returns {HyperExponentialCostScaling}
   */
  get costScale() {
    return new HyperExponentialCostScaling({
      baseCost: new Decimal(this._baseCost),
      baseIncrease: Decimal.max(this._baseCostMultiplier.div(NullUpgrades.all[7].isUnlocked ? 2.5 : 1), 2.5),
      costScale: new Decimal(1000),
      scalingCostThreshold: new Decimal('1e1000'),
      strength: 5,
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(this.bought);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return ratio.min(1).max(0).floor().toNumber();
  }

  buy(bulk = false){

    if(bulk){
      let total = this.costScale.getMaxBought(this.bought, this.currencyAmount, 1)?.quantity;
      if(total != undefined && total.gt(0)) {
        this.bought = this.bought.add(total);
        if(this.currencyAmount.lt('ee15')) this.currencyAmount = this.currencyAmount.sub(this.costScale.calculateCost(this.bought.sub(1)));
      }
    }
    else{
      if(this.cost.lte(this.currencyAmount)){
        if(this.currencyAmount.lt('ee15')) this.currencyAmount = this.currencyAmount.sub(this.cost);
        this.bought = this.bought.add(1);
      }
    }

  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return Currency.abyssalMatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    Currency.abyssalMatter.value = value;
  }

  get totalAmount() {
    return this.amount;
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    return this.cost.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {

    return false;
  }

  reset() {
    if(this.tier == 1) this.amount = DC.D1;
    else this.amount = DC.D0;
    this.bought = DC.D0;
  }

  resetAmount() {
    this.amount = DC.D1;
  }

  get rawMultiplier() {
    let mult = DC.D0_001;

    mult = mult.mul(NullCycles.buyMultiplier.pow(this.bought));
    mult = mult.mul(NullUpgrades.all[0].effectOrDefault(1));
    mult = mult.mul(Parallax.multiplier);
    if (this.tier == 1) mult = mult.mul(NullUpgrades.all[2].effectOrDefault(1));
    mult = mult.mul(NullUpgrades.all[6].effectOrDefault(1));
    mult = mult.mul(NullUpgrades.all[12].effectOrDefault(1));
    
    if(NullUpgrades.all[8].isUnlocked) mult = mult.mul(Decimal.absLog10(this.amount.add(10)).pow(1.65));

    if (this.tier % 2 == 0) mult = mult.mul(NullUpgrades.all[3].effectOrDefault(1));

    
    if (NullUpgrades.all[10].isUnlocked && this.tier == NullCycles.highestUnlocked) mult = mult.mul(this.amount.add(10).absLog10().pow(2.5));

    if (mult.gt(1)) {
      mult = mult.pow(Parallax.power);
      mult = mult.pow(NullUpgrades.all[1].effectOrDefault(1));
      mult = mult.pow(NullUpgrades.all[13].effectOrDefault(1));
    }

    
    if(mult.gt(1e15)) mult = mult.div(mult.div(1e15).pow(NullUpgrades.all[17].isUnlocked ? 0.2 : 0.35));
    if(mult.gt(1e20)) mult = mult.div(mult.div(1e20).pow(NullUpgrades.all[17].isUnlocked ? 0.3 : 0.5));
    if(mult.gt('e250')) mult = mult.div(mult.div('e250').pow(NullUpgrades.all[17].isUnlocked ? 0.125 : 0.25));
    if(mult.gt('e6000')) mult = mult.div(mult.div('e6000').pow(0.85));
    if(mult.gte('ee4')) mult = mult.pow(mult.add('ee4').log('ee4').pow(0.5).recip());
    if(mult.gte('ee6')) mult = mult.pow(mult.add('ee6').log('ee6').pow(0.8).recip());
    if(mult.gte('ee10')) mult = mult.pow(mult.add('ee10').log('ee10').pow(0.95).recip());

    return mult;
  }

  get multiplier() {
    let mult = this.rawMultiplier;

    mult = mult.div(this.amount.pow((Corrupt.corrupts.gt(0) ? 0.2 : 0.25) * NullUpgrades.all[14].effectOrDefault(1))); // this should be last

    return mult;
  }

  get productionPerSecond() {
    return this.totalAmount.times(this.multiplier);
  }

  get unlocked() {
    if(Null.isCorrupt) return true;
    if (this.tier < Parallax.parallaxes.add(4).min(9).toNumber()) return true;
    return false;
  }

  productionForDiff(diff) {
    return this.totalAmount.mul(this.multiplier.mul(diff.div(1000)));
  }

  produceDimensions(dimension, diff) {
    if (this.tier == 1 && this.amount.lt(1)) this.amount = DC.D1;
    if(!this.isProducing) return;
    dimension.amount = dimension.amount.add(this.productionForDiff(diff));
  }

  produceCurrency(currency, diff){
    currency.add(this.amount.pow(0.55 * NullUpgrades.all[4].effectOrDefault(1)).mul(Corrupt.multiplier).mul(diff.div(1000)));
  }

  produceCorrupt(currency, diff){
    currency.add(this.amount.add(10).log10().mul(Decimal.pow(NullUpgrades.all[18].isUnlocked ? 8.5 : 4, Corrupt.corrupts)).div(DC.E3).mul(diff.div(1000)));
  }

  static get dimensionCount() { return 16; }

}

/**
 * @function
 * @param {number} tier
 * @return {NullCycleState}
 */
export const NullCycle = NullCycleState.createAccessor();

export const NullCycles = {
  /**
   * @type {NullCycleState[]}
   */
  all: NullCycle.index.compact(),

  reset() {
    for (let tier = 16; tier > 0; --tier) {
      NullCycle(tier).reset();
    }
  },

  resetAmountUpToTier(maxTier) {
    for (let tier = 1; tier < maxTier; tier++) {
      NullCycle(tier).reset();
    }
  },

  get buyMultiplier() {
    return new Decimal(2).mul(NullUpgrades.all[9].effectOrDefault(1));
  },

  get highestUnlocked() {
    // if(Null.isCorrupt) return 16;
    for (let a = 15; a >= 0; a--) {
      if (this.all[a].unlocked) return a+1;
    }
    return 0;
  },

  tick(diff) {
    const highest = this.highestUnlocked;
    for (let tier = 1; tier < 17; tier++) {
      if (tier == highest) {
        NullCycle(highest).produceDimensions(NullCycle(1), diff);
        NullCycle(highest).produceCurrency(Currency.abyssalMatter, diff);
        if(Corrupt.corrupts.gte(1)) NullCycle(highest).produceCorrupt(Currency.corruptMatter, diff);
      }
      else if (NullCycle(tier).unlocked) NullCycle(tier).produceDimensions(NullCycle(tier+1), diff);
    }
  },


};
