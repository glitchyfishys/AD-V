import { DC } from "../constants";

import { DimensionState } from "./dimension";

// Multiplier applied to all Antimatter Dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
export function antimatterDimensionCommonMultiplier() {
  let multiplier = DC.D1;

  multiplier = multiplier.times(Achievements.power);
  multiplier = multiplier.times(ShopPurchase.dimPurchases.currentMult);
  multiplier = multiplier.times(ShopPurchase.allDimPurchases.currentMult);

  if (!EternityChallenge(9).isRunning) {
    multiplier = multiplier.times(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).clamp(1, "1e1E300"));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    AlchemyResource.dimensionality,
    PelleUpgrade.antimatterDimensionMult,
    preInfinityUGs.all[0],
    preInfinityUGs.all[1],
    preInfinityUGs.all[2]
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));
  multiplier = multiplier.times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));
  
  if (Pelle.isDoomed) multiplier = multiplier.dividedBy(10);

  return multiplier;
}

export function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 8) throw new Error(`Invalid Antimatter Dimension tier ${tier}`);
  if (NormalChallenge(10).isRunning && tier > 6) return DC.D1;
  if (EternityChallenge(11).isRunning) {
    let multiplier = Currency.infinityPower.value.pow(
      InfinityDimensions.powerConversionRate
    ).max(1).times(DimBoost.multiplierToADTier(tier));

    if (V.isRunningExtreme) {
      multiplier = multiplier.pow(0.001);
    }
    
    multiplier = multiplier.pow(V.rageDimPower);
    return multiplier;
  }

  let multiplier = DC.D1;

  multiplier = applyADMultipliers(multiplier, tier);
  multiplier = applyADPowers(multiplier, tier);

  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");
  
  if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.adMultDT);

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  }
  
  if (V.isRunning) {
    multiplier = multiplier.pow(0.5);
  }

  if (Glitch.isRunning) {
    multiplier = multiplier.pow(Glitch.ADnerf);
  }
  
  let mul = GlitchRealityUpgrades.all[4].effectOrDefault(new Decimal(1)).pow(GlitchRealityUpgrades.all[12].isBought ? 2 : 1).pow(1 / Glitch.decay);

  if (Glitch.isRunning && !GlitchRealityUpgrades.all[4].isBought) {
    multiplier = multiplier.pow(1.66);
  }

  multiplier = multiplier.pow(GlitchRealityUpgrades.all[15].effectOrDefault(1));
  
  if (V.isRunningExtreme) {
    multiplier = multiplier.pow(0.001);
  }

  if(Pelle.isDoomed) mul = mul.pow((1 / ((1e60 / Math.min(Currency.realityShards.value.toNumber(),1e60)) ** .16)));
  
  if(player.dilation.active && Pelle.isDoomed) mul = dilatedValueOf(mul);

  if(!V.isRunningExtreme) multiplier = multiplier.mul(mul);
  
  multiplier = multiplier.pow(V.rageDimPower);
  

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (AlchemyResource.inflation.isUnlocked && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }

  if(multiplier.gt("1e1E26") && !MetaFabricatorUpgrade(15).isBought) multiplier = multiplier.pow( 1 / Math.sqrt(multiplier.log10() / 1e26) );
  if(multiplier.gt("1e1E30")) multiplier = multiplier.pow( 1 / ((multiplier.log10() / 1e30) ** 0.85) );

  multiplier = multiplier.pow(Ra.unlocks.repAD.effectOrDefault(1));
  
  if(multiplier.gt("1e1E50")) multiplier = multiplier.pow( 1 / ((multiplier.log10() / 1e50) ** 0.3) );
  if(multiplier.gt("1e1E100")) multiplier = multiplier.pow( 1 / ((multiplier.log10() / 1e100) ** 0.35) );
  if(multiplier.gt("1e1E200")) multiplier = multiplier.pow( 1 / ((multiplier.log10() / 1e200) ** 0.5) );
  
  return multiplier;
}

function applyADMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.antimatterDimensionCommonMultiplier.value);

  let buy10Value;
  if (Laitela.continuumActive) {
    buy10Value = AntimatterDimension(tier).continuumValue;
  } else {
    buy10Value = Math.floor(AntimatterDimension(tier).bought / 10);
  }

  if(buy10Value > 1e18) buy10Value = buy10Value / (buy10Value / 1e18) ** (MetaFabricatorUpgrade(15).isBought ? 0.45 : 0.9);

  multiplier = multiplier.times(Decimal.pow(AntimatterDimensions.buyTenMultiplier, buy10Value));
  multiplier = multiplier.times(DimBoost.multiplierToADTier(tier));

  let infinitiedMult = DC.D1.timesEffectsOf(
    AntimatterDimension(tier).infinityUpgrade,
    BreakInfinityUpgrade.infinitiedMult
  );
  infinitiedMult = infinitiedMult.pow(TimeStudy(31).effectOrDefault(1));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        TimeStudy(234),
        GlitchRifts.alpha.milestones[0],
        preInfinityUGs.all[3]
      );
  }
  if (tier === 8) {
    multiplier = multiplier.times(Sacrifice.totalBoost);
    multiplier = multiplier.times(GlitchRifts.alpha.milestones[1].effectOrDefault(1));
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(64) : null,
    tier < 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );
  if (Achievement(43).isUnlocked) {
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyADPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(MetaFabricatorUpgrades.all[1].effectOrDefault(1));

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier * Ra.momentumValue);

  multiplier = multiplier
    .powEffectsOf(
      AntimatterDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power,
      Achievement(183),
      PelleRifts.paradox,
      PelleRifts.glitch
    );

  multiplier = multiplier.pow(getAdjustedGlyphEffect("curseddimensions"));

  if(isInCelestialReality()) multiplier = multiplier.pow(getAdjustedGlyphEffect("glitchADCelPow"));

  multiplier = multiplier.pow(TimeStudy(401).effectOrDefault(1));

  multiplier = multiplier.pow(VUnlocks.adPow.effectOrDefault(1));

  if (PelleStrikes.infinity.hasStrike) {
    multiplier = multiplier.pow(0.5);
  }


  return multiplier;
}

function onBuyDimension(tier) {
  if (tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM1);
  if (tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
  
  Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (player.speedrun.isActive && !player.speedrun.hasStarted) Speedrun.startTimer();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) {
    AntimatterDimensions.resetAmountUpToTier(tier - 1);
  }

  player.postC4Tier = tier;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  if (tier !== 8) player.requirementChecks.eternity.onlyAD8 = false;
  if (tier !== 1) player.requirementChecks.eternity.onlyAD1 = false;
  if (tier === 8) player.requirementChecks.infinity.noAD8 = false;
  if (tier === 1) player.requirementChecks.eternity.noAD1 = false;
}

export function buyOneDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && player.options.confirmations.glitchCL && player.dimensionBoosts == 4 && player.galaxies == 0) {
    if(dimension.bought > 0) {
      Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[3].config.name} <br> which is to ${preInfinityUGs.all[3].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
      return;
    }
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && player.options.confirmations.glitchCL && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && player.options.confirmations.glitchCL && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  const cost = dimension.cost;

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed && AntimatterDimension(8).bought >= 1) return false;

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10 === 9) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (tier === 1) {
    Achievement(28).tryUnlock();
  }

  onBuyDimension(tier);

  return true;
}

export function buyManyDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && player.options.confirmations.glitchCL && player.dimensionBoosts == 4 && player.galaxies == 0) {
    if(dimension.bought < 1) buyOneDimension(tier);
    return;
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && player.options.confirmations.glitchCL && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && player.options.confirmations.glitchCL && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }


  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) return buyOneDimension(8);

  if(dimension.currencyAmount.e < 20) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;

    
  onBuyDimension(tier);

  return true;
}

export function buyAsManyAsYouCanBuy(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  
  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && player.options.confirmations.glitchCL && player.dimensionBoosts == 4 && player.galaxies == 0) {
    if(dimension.bought < 1) buyOneDimension(tier);
    return;
  }
  else if(((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && player.options.confirmations.glitchCL && tier != 1 && (tier == 2 ? AntimatterDimension(2).amount.gte(10) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && player.options.confirmations.glitchCL && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  

  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) return buyOneDimension(8);
  const adtotal = (dimension.bought + howMany);
  
  if(dimension.currencyAmount.e < 1e15) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  
  if(adtotal >= 1e18) {
    howMany = Math.max(howMany / Math.log(howMany - 1e18), 1e18);
    dimension.bought = howMany;
    dimension.amount = new Decimal(howMany);
  }else{
    dimension.bought += howMany;
    dimension.amount = dimension.amount.plus(howMany);
  }
  

  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  if (Laitela.continuumActive) return;
  const dimension = AntimatterDimension(tier);

  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && player.options.confirmations.glitchCL && player.dimensionBoosts == 4 && player.galaxies == 0) {
    if(dimension.bought < 1) buyOneDimension(tier);
    return;
  }
  else if((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && player.options.confirmations.glitchCL && tier != 1 && (tier == 2 ? AntimatterDimension(tier).amount.gte(10) : true) && player.dimensionBoosts == 0 && player.galaxies == 1){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[4].config.name} <br> which is to ${preInfinityUGs.all[4].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }
  else if(((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && player.options.confirmations.glitchCL && tier > 3 && (tier == 4 ? AntimatterDimension(4).amount.gte(20) : true) && player.dimensionBoosts == 0 && player.galaxies == 1)){
    Modal.message.show(`you will fail glitch challenge ${preInfinityUGs.all[5].config.name} <br> which is to ${preInfinityUGs.all[5].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
    return;
  }

  dimension.challengeCostBump();
  dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10));
  dimension.bought += dimension.remainingUntil10;
  onBuyDimension(tier);
}

export function maxAll() {
  if (Laitela.continuumActive) return;

  player.requirementChecks.infinity.maxAll = true;

  for (let tier = 1; tier < 9; tier++) {
    buyMaxDimension(tier);
  }

  // Do this here because tickspeed might not have been unlocked before
  // (and maxAll might have unlocked it by buying dimensions).
  buyMaxTickSpeed();
}

export function buyMaxDimension(tier, bulk = Infinity) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;

  if((!preInfinityUGs.all[4].config.hasFailed() && !preInfinityUGs.all[4].isBought) && player.options.confirmations.glitchCL && tier >= 2 && player.galaxies == 1){
    if(tier > 2) return
    if(dimension.bought >= 10) return;
    Math.clampMax(dimension.bought,10);
    bulk = 1 - dimension.bought/10;
  }

  if((!preInfinityUGs.all[5].config.hasFailed() && !preInfinityUGs.all[5].isBought) && player.options.confirmations.glitchCL && tier >= 4 && player.galaxies == 1){
    if(tier > 4) return
    if(dimension.bought >= 20) return;
    Math.clampMax(dimension.bought,20);
    bulk = 2 - dimension.bought/10;
  }
  
  if ((!preInfinityUGs.all[3].config.hasFailed() && !preInfinityUGs.all[3].isBought) && player.options.confirmations.glitchCL && player.dimensionBoosts == 4 && player.galaxies == 0) {
    if(dimension.bought < 1) buyOneDimension(tier);
    return;
  }

  const cost = dimension.costUntil10;
  let bulkLeft = bulk;
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && Player.isInAntimatterChallenge) return;

  const allow = (Enslaved.isRunning && !Glitch.isRunning);
  const allowed = (allow || Glitch.augmentEffectActive(3));
  
  if (tier === 8 && allowed) {
    buyOneDimension(8);
    return;
  }

  // Buy any remaining until 10 before attempting to bulk-buy
  if (dimension.currencyAmount.gte(cost)) {
    if(dimension.currencyAmount.e < 20) dimension.currencyAmount = dimension.currencyAmount.minus(cost);
    buyUntilTen(tier);
    bulkLeft--;
  }

  if (bulkLeft <= 0) return;

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft > 0) {
      // We can use dimension.currencyAmount or Currency.antimatter here, they're the same,
      // but it seems safest to use dimension.currencyAmount for consistency.
      if(dimension.currencyAmount.e < 20) dimension.currencyAmount = dimension.currencyAmount.minus(dimension.costUntil10);
      buyUntilTen(tier);
      bulkLeft--;
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    Math.floor(dimension.bought / 10) + dimension.costBumps, dimension.currencyAmount, 10
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying > bulkLeft) buying = bulkLeft;
  dimension.amount = dimension.amount.plus(10 * buying).round();
  dimension.bought += 10 * buying;
  if(dimension.currencyAmount.e < 20) dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice));
}

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(Math.floor(this.bought / 10) + this.costBumps);
  }

  /** @returns {number} */
  get costBumps() { return this.data.costBumps; }
  /** @param {number} value */
  set costBumps(value) { this.data.costBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought % 10;
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber();
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return DC.D0;
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = AntimatterDimension(tier + 2).productionPerSecond;
    } else {
      toGain = AntimatterDimension(tier + 1).productionPerSecond;
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    const tier = this.tier;
    if ((EternityChallenge(3).isRunning && tier > 4) ||
      (NormalChallenge(10).isRunning && tier > 6) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount
      : Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) AntimatterDimension(this.tier - 2).amount = value;
    else Currency.antimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return 0;
    // Nameless limits dim 8 purchases to 1 only
    // Continuum should be no different
    const allow = (Enslaved.isRunning && !Glitch.isRunning);
    const allowed = (allow || Glitch.augmentEffectActive(3));
    
    if (this.tier === 8 && allowed) return 1;
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    let amount = this.costScale.getContinuumValue(this.currencyAmount, 10) * Laitela.matterExtraPurchaseFactor;
    
    return amount;
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive) return 0;
    return Math.floor(10 * this.continuumValue);
  }

  /**
   * Continuum doesn't continually update dimension amount because that would require making the code
   * significantly messier to handle it properly. Instead an effective amount is calculated here, which
   * is only used for production and checking for boost/galaxy. Doesn't affect achievements.
   * Taking the max is kind of a hack but it seems to work in all cases. Obviously it works if
   * continuum isn't unlocked. If the dimension is being produced and the continuum is unlocked,
   * the dimension will be being produced in large numbers (since the save is endgame), so the amount
   * will be larger than the continuum and so the continuum is insignificant, which is fine.
   * If the dimension isn't being produced, the continuum will be at least the amount, so
   * the continuum will be used and that's fine. Note that when continuum is first unlocked,
   * both 8d amount and 8d continuum will be nonzero until the next infinity, so taking the sum
   * doesn't work.
   * @param {Decimal} value
   */
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (Laitela.continuumActive) return false;
    if (!player.break && this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return this.costUntil10.lte(this.currencyAmount);
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
    this.costBumps = 0;
  }

  resetAmount() {
    this.amount = DC.D0;
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.e === this.cost.e) {
        dimension.costBumps++;
      }
    }
    if (Tickspeed.cost.e === this.cost.e) player.chall9TickspeedCostBumps++;
  }

  multiplyIC5Costs() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.lt(this.cost)) {
        dimension.costBumps++;
      } else if (this.tier >= 5 && dimension.cost.gt(this.cost)) {
        dimension.costBumps++;
      }
    }
  }

  get multiplier() {
    return GameCache.antimatterDimensionFinalMultipliers[this.tier].value;
  }

  get cappedProductionInNormalChallenges() {
    const postBreak = (player.break && !NormalChallenge.isRunning) ||
      InfinityChallenge.isRunning ||
      Enslaved.isRunning;
    return postBreak ? DC.LIMIT : DC.E315;
  }

  get productionPerSecond() {
    const tier = this.tier;
    if (Laitela.isRunning && tier > Laitela.maxAllowedDimension) return DC.D0;
    let amount = this.totalAmount;
    if (NormalChallenge(12).isRunning) {
      if (tier === 2) amount = amount.pow(1.6);
      if (tier === 4) amount = amount.pow(1.4);
      if (tier === 6) amount = amount.pow(1.2);
    }
    let production = amount.times(this.multiplier).times(Tickspeed.perSecond);
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.chall2Pow);
    }
    if (tier === 1) {
      if (NormalChallenge(3).isRunning) {
        production = production.times(player.chall3Pow);
      }
      if (production.gt(10)) {
        const log10 = production.log10();
        production = Decimal.pow10(Math.pow(log10, getAdjustedGlyphEffect("effarigantimatter")));
      }
    }
    production = production.min(this.cappedProductionInNormalChallenges);
    
    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  /**
   * @type {AntimatterDimensionState[]}
   */
  all: AntimatterDimension.index.compact(),

  reset() {
    for (const dimension of AntimatterDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of AntimatterDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    if (NormalChallenge(7).isRunning) return DC.D2.min(1 + DimBoost.totalBoosts / 5);

    let mult = DC.D2.plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );

    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigforgotten")).powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);
    mult = mult.pow(ImaginaryUpgrade(14).effectOrDefault(1));

    return mult;
  },

  tick(diff) {
    // Stop producing antimatter at Big Crunch goal because all the game elements
    // are hidden when pre-break Big Crunch button is on screen.
    const hasBigCrunchGoal = !player.break || Player.isInAntimatterChallenge;
    if (hasBigCrunchGoal && Currency.antimatter.gte(Player.infinityGoal)) return;

    let maxTierProduced = EternityChallenge(3).isRunning ? 3 : 7;
    let nextTierOffset = 1;
    if (NormalChallenge(12).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) {
      AntimatterDimension(tier + nextTierOffset).produceDimensions(AntimatterDimension(tier), diff.div(10));
    }
    if (AntimatterDimension(1).amount.gt(0)) {
      player.requirementChecks.eternity.noAD1 = false;
    }
    AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
    if (NormalChallenge(12).isRunning) {
      AntimatterDimension(2).produceCurrency(Currency.antimatter, diff);
    }
    // Production may overshoot the goal on the final tick of the challenge
    if (hasBigCrunchGoal) Currency.antimatter.dropTo(Player.infinityGoal);
  }
};
