import { DimensionState } from "../../dimensions/dimension";
import { DC } from "../../constants";

function CanteReplicatorMultiplyer(){
  let mult = DC.D1
}

class CanteReplicatorState extends DimensionState {
  constructor(tier) {
    super(() => player.celestials.cante.replicators, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {HyperExponentialCostScaling}
   */
  get costScale() {
    return new HyperExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._baseCostMultiplier,
      costScale: 1000,
      scalingCostThreshold: new Decimal('1e500'),
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
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 1), 0)).toNumber();
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
    return Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    Currency.antimatter.value = value;
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
    if (!EternityMilestone.unlockAllAD.isReached && this.tier > DimBoost.totalBoosts + 4) return false;
    const hasPrevTier = this.tier === 1 || AntimatterDimension(this.tier - 1).totalAmount.gt(0);
    if (!EternityMilestone.unlockAllAD.isReached && !hasPrevTier) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = DC.D0;
    this.bought = 0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }

  get multiplier() {
    return CanteReplicatorMultiplyer();
  }

  get productionPerSecond() {
    let amount = this.totalAmount;
    let production = amount.times(this.multiplier);

    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
export const CanteReplicator = CanteReplicatorState.createAccessor();

export const CanteReplicators = {
  /**
   * @type {CanteReplicatorState[]}
   */
  all: CanteReplicator.index.compact(),

  reset() {
    for (const dimension of CanteReplicator.all) {
      dimension.reset();
    }
  },

  resetAmountUpToTier(maxTier) {
    for (const replicator of CanteReplicator.all.slice(0, maxTier)) {
      replicator.resetAmount();
    }
  },

  get buyTenMultiplier() {
    let mult = DC.D2

    return mult;
  },

  tick(diff) {

    for (let tier = CanteReplicator.all.length; tier >= 0; --tier) {
      CanteReplicator(tier).produce(CanteReplicator(tier), diff.div(10));
    }
  }
};

export const GlitchRifts = mapGameDataToObject(
  GameDatabase.celestials.cante.replicator,
  config => new CanteReplicatorState(config)
);
