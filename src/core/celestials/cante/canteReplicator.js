import { DimensionState } from "../../dimensions/dimension";
import { DC } from "../../constants";

class CanteReplicatorState extends DimensionState {
  constructor(tier) {
    super(() => player.celestials.cante.replicators, tier);
    const BASE_COSTS = [null, 1, 1e3, 5e7, 1e83, new Decimal('1e308'), new Decimal('1e20000'), new Decimal('1e1E5'), new Decimal('1e1E7'), new Decimal('1e1E8'), new Decimal('1e1E10')];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 10, 185, 650, 8e3, 5e4, 1e10, 2e30, 5e80, 5e180, 1.79e308];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {HyperExponentialCostScaling}
   */
  get costScale() {
    return new HyperExponentialCostScaling({
      baseCost: new Decimal(this._baseCost),
      baseIncrease: Decimal.max(this._baseCostMultiplier * CanteUpgrades.all[0].effectOrDefault(1) * (CanteUpgrades.all[3].canBeApplied ? 0.5 : 1), 1.5),
      costScale: new Decimal(1000 / CanteUpgrades.all[6].effectOrDefault(1)),
      scalingCostThreshold: new Decimal('1e100').mul(CanteUpgrades.all[4].effectOrDefault(1)),
      strength: 2.5,
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
    return Currency.artificialMatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    Currency.artificialMatter.value = value;
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
    this.amount = DC.D1;
    this.bought = DC.D0;
  }

  resetAmount() {
    this.amount = DC.D1;
  }

  get multiplier() {
    let mult = DC.D2_5.mul(Currency.chaosMatter.value.add(10).log10().pow(7));
    mult = mult.mul(CanteReplicators.buyMultiplier.pow(this.tier).pow(this.bought));
    mult = mult.div(new Decimal(1e8).pow(this.tier -1));
    mult = mult.mul(CanteUpgrades.all[1].effectOrDefault(1));
    mult = mult.mul(CanteUpgrades.all[2].canBeApplied ? (CanteReplicator(this.tier + (this.tier == 10 ? 0 : 1)).amount.add(10).log10().pow(5)) : 1 );
    mult = mult.mul(CanteUpgrades.all[3].effectOrDefault(1));
    
    mult = mult.mul(CanteUpgrades.all[5].canBeApplied ? (this.amount.pow(0.0062)) : 1);
    
    mult = mult.mul(CanteUpgrades.all[10].effectOrDefault(1));
    
    
    mult = mult.pow(CanteUpgrades.all[7].canBeApplied ? (this.tier ** 0.5) : 1);
    
    if(this.amount.gte(1.79e308)) mult = mult.div(this.amount.div(1.79e308).pow(0.003 / CanteUpgrades.all[9].effectOrDefault(1)));
    if(this.amount.gte('1e1000')) mult = mult.div(this.amount.div('1e1000').pow(0.05 / CanteUpgrades.all[9].effectOrDefault(1)));
    if(this.amount.gte('1e1000000')) mult = mult.div(this.amount.div('1e1000000').pow(0.1 / CanteUpgrades.all[9].effectOrDefault(1)));
    if(this.amount.gte('1e1E20')) mult = mult.div(this.amount.div('1e1E20').pow(0.3));
    if(this.amount.gte('1e1E80')) mult = mult.div(this.amount.div('1e1E80').pow(0.5));
    if(this.amount.gte('1e1E150')) mult = mult.div(this.amount.div('1e1E150').pow(0.8));
    if(this.amount.gte('1e1E250')) mult = mult.div(this.amount.div('1e1E250').pow(0.99));
    return mult;
  }

  get productionPerSecond() {
    return this.totalAmount.times(this.multiplier);
  }

  get unlocked() {
    const u = Cante.repUnlocks[this.tier -1].condition() || (player.celestials.cante.replicatorUnlockbits & (1 << this.tier)) != 0;
    if(u) player.celestials.cante.replicatorUnlockbits |= (1 << this.tier);
    return u;
  }
  get unlockReq() {
    return Cante.repUnlocks[this.tier -1].unlock();
  }

  productionForDiff(diff) {
    return this.totalAmount.mul(this.multiplier.mul(diff.div(1000)));
  }

  // produceCurrency(currency, diff) {
  //   currency.add(this.productionForDiff(diff));
  // }

  produceDimensions(dimension, diff) {
    dimension.amount = dimension.amount.add(this.productionForDiff(diff));
  }

  static get dimensionCount() { return 10; }

}

/**
 * @function
 * @param {number} tier
 * @return {CanteReplicatorState}
 */
export const CanteReplicator = CanteReplicatorState.createAccessor();

export const CanteReplicators = {
  /**
   * @type {CanteReplicatorState[]}
   */
  all: CanteReplicator.index.compact(),

  reset() {
    for (let tier = 10; tier > 0; --tier) {
      CanteReplicator(tier).reset();
    }
  },

  resetAmountUpToTier(maxTier) {
    for (let tier = 1; tier < maxTier; tier++) {
      CanteReplicator(tier).reset();
    }
  },

  get buyMultiplier() {
    return new Decimal(8.5).mul(Currency.chaosMatter.value.add(10).log10())
    .pow(CanteUpgrades.all[16].effectOrDefault(1));
  },

  tick(diff) {

    for (let tier = 10; tier > 0; --tier) {
      if(CanteReplicator(tier).unlocked) CanteReplicator(tier).produceDimensions(CanteReplicator(tier), diff);
    }
  },

  reforge(){
    Currency.artificialMatter.add(this.totalArtMatterGain());
    for (let tier = 10; tier > 0; --tier) {
      if(CanteReplicator(tier).amount.gte(Decimal.NUMBER_MAX_VALUE)) CanteReplicator(tier).resetAmount();
    }
    Cante.quotes.reforge.show();
  },

  purge(){
    if(Currency.artificialMatter.lt('1e75000')) return;
    Currency.chaosMatter.add(this.chaosMatterGain);
    Currency.artificialMatter.reset();
    for (let tier = 10; tier > 0; --tier) {
      CanteReplicator(tier).reset();
    }
    if(!CanteUpgrades.all[12].canBeApplied){
      CanteUpgrades.all[0].reset();
      CanteUpgrades.all[1].reset();
      CanteUpgrades.all[2].reset();
      CanteUpgrades.all[3].reset();
      CanteUpgrades.all[4].reset();
      CanteUpgrades.all[5].reset();
      CanteUpgrades.all[6].reset();
      CanteUpgrades.all[7].reset();
      CanteUpgrades.all[8].reset();
    }
    player.celestials.cante.purges++;
    Cante.quotes.purge.show();
  },

  get chaosMatterGain(){
    let v = CanteUpgrades.all[18].isUnlocked ? Currency.artificialMatter.value.add(2).log2().pow(1.05).sub(75000) : Currency.artificialMatter.value.add(10).log10().sub(75000);
    v = v.div(5000);
    v = v.mul(CanteUpgrades.all[14].effectOrDefault(1));
    v = v.mul(CanteUpgrades.all[15].effectOrDefault(1));
    return v.max(0).add(1).floor();
  },

  artMatterGain(amount){
    const l = amount.add(10).log10();
    let g = l.sub(308.25);
    g = g.mul(l.pow(1.2).div(308.25).pow(l.pow(1.1).div(308.25)));
    if(g.gt(1e10)) g = g.div(g.div(1e10).pow(0.125 * CanteUpgrades.all[13].effectOrDefault(1)));
    return g;
  },

  totalArtMatterGain(){
    let v = DC.D1;
    for (let tier = 10; tier > 0; --tier) {
      if(CanteReplicator(tier).amount.gte(Decimal.NUMBER_MAX_VALUE)) {
        v = v.mul(this.artMatterGain(CanteReplicator(tier).amount));
      }
    }

    if(v.gte('ee4')) v = v.pow( v.div('ee4').add('e308').log('e308').pow(0.165 * CanteUpgrades.all[13].effectOrDefault(1)).recip() );
    if(v.gte('ee5')) v = v.div(v.div('ee5').pow(0.8 * CanteUpgrades.all[13].effectOrDefault(1)));
    if(v.gte('ee8')) v = v.div(v.div('ee8').pow(0.75));
    if(v.gte('ee10')) v = v.div(v.div('ee10').pow(0.666));
    if(v.gte('ee12')) v = v.pow(v.add('ee12').log('ee12').pow(0.95).recip());
    return v.sub(1).floor();
  }
};
