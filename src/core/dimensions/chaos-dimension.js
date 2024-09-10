import { DC } from "../constants";

import { DimensionState } from "./dimension";

// Multiplier applied to all Chaos Dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
export function chaosDimensionCommonMultiplier() {
  let multiplier = DC.D1;

  return multiplier;
}

export function getChaosDimensionFinalMultiplierUncached(tier) {
  const dimension = ChaosDimension(tier);
  if (tier < 1 || tier > 8) throw new Error(`Invalid Chaos Dimension tier ${tier}`);
  
  let multiplier = DC.D1;

  multiplier = multiplier.mul(Decimal.pow(dimension.perPurchase, dimension.bought));

  if(multiplier.gt("1e1E15")) multiplier = multiplier.pow( 1 / Math.sqrt(multiplier.log10() / 1e15) );
  
  return multiplier;
}

function applyCDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.chaosDimensionCommonMultiplier.value);
  
  return multiplier.clampMin(1);
}

function applyCDPowers(mult, tier) {
  let multiplier = mult;

  return multiplier;
}

function onBuyChaosDimension(tier) {
  
}

export function maxAllChaos() {

  for (let tier = 1; tier < 9; tier++) {
    buyMaxChaosDimension(tier);
  }

}

export function buyMaxChaosDimension(tier, bulk = Infinity) {
  const dimension = ChaosDimension(tier);
  if (!dimension.isAvailableForPurchase) return;
  
  let bulkLeft = bulk;

  if (bulkLeft <= 0) return;

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    Math.floor(dimension.bought), dimension.currencyAmount, 1
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying > bulkLeft) buying = bulkLeft;
  dimension.amount = dimension.amount.plus(buying).round();
  dimension.bought +=  buying;
  if(dimension.currencyAmount.e < 1e15) dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice));
}

class ChaosDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.chaos, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e8, 1e16, 1e21, 1e35, 1e50, new Decimal("1e1000"), new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e15E3")];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e4, 1e7, 1e12, 1e15, 1e18, 1e24, 1e30, 1e34];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const PER_PURCHASE = [null, 10, 20, 40, 80, 160, 320, 640, 1280];
    this.perPurchase = PER_PURCHASE[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._baseCostMultiplier,
      costScale: 10000,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(Math.floor(this.bought));
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 0), 0)).toNumber();
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;

    let toGain = ChaosDimension(tier + 1).productionPerSecond;
    
    return toGain.times(10).dividedBy(this.amount.max(1));
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
    return Currency.chaosCores.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    Currency.chaosCores.value = value;
  }

  get totalAmount() {
    return this.amount;
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    return true;
  }

  reset() {
    this.amount = DC.D0;
    this.bought = 0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }


  get multiplier() {
    return getChaosDimensionFinalMultiplierUncached(this.tier);
  }


  get productionPerSecond() {
    if(this.amount.eq(0)) return DC.D0;
    
    let production = this.multiplier.mul(this.totalAmount);

    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {ChaosDimensionState}
 */
export const ChaosDimension = ChaosDimensionState.createAccessor();

export const ChaosDimensions = {
  /**
   * @type {ChaosDimensionState[]}
   */
  all: ChaosDimension.index.compact(),

  reset() {
    for (const dimension of ChaosDimensions.all) {
      dimension.reset();
    }
  },

  get buyTenMultiplier() {
    return this.perPurchase;
  },

  buy(){
    const dimension = ChaosDimension(this.tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  
    const cost = dimension.cost;
  
    dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  
    dimension.amount = dimension.amount.plus(1);
    dimension.bought++;
  
    onBuyChaosDimension(tier);
  
    return true;
  },

  buyMax(){
    const dimension = ChaosDimension(this.tier);
    if (!dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

    const howMany = dimension.howManyCanBuy;
    const cost = dimension.cost.times(howMany);
    
    if(dimension.currencyAmount.e < 1e15) dimension.currencyAmount = dimension.currencyAmount.minus(cost);

    dimension.bought += howMany;
    dimension.amount = dimension.amount.plus(howMany);

    onBuyChaosDimension(tier);

    return true;
  },

  tick(diff) {

    for (let tier = 8; tier > 1; --tier) {
      ChaosDimension(tier).produceDimensions(ChaosDimension(tier -1), diff.div(10));
    }

    ChaosDimension(1).produceCurrency(Currency.chaosCores, diff);
  }
};
