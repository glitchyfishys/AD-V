class ParallaxRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const cyc = NullCycle(1);
    return cyc.totalAmount.gte(this.amount);
  }
}

export class Parallax {
  static get boost() {
    let boost = new Decimal(2);
    boost = boost.mul(NullUpgrades.all[10].isUnlocked ? 2.5 : 1);
    return boost;
  }

  static get powBoost() {
    let boost = new Decimal(0.1);
    return boost;
  }

  static get power() {
    if(!NullUpgrades.all[7].isUnlocked) return new Decimal(1);
    const mult = new Decimal(Parallax.powBoost).mul(this.parallaxes).add(1);
    return mult;
  }

  static get multiplier() {
    const mult = Parallax.boost.pow(this.parallaxes).clampMin(1);
    return mult;
  }

  static get canBeBought() {
    return true;
  }

  static baseRequirement = [1e14, 1e22, 1e30, 1e48, 1e70, 1e100];

  static get requirement() {
    if(Parallax.baseRequirement[Parallax.parallaxes] != undefined) return new ParallaxRequirement(1, Parallax.baseRequirement[Parallax.parallaxes]);
    return Parallax.bulkRequirement(Parallax.parallaxes.add(1));
  }

  static get bulkAmount(){
    const k = new ExponentialCostScaling({
        baseCost: new Decimal(1),
          baseIncrease: new Decimal(1.000000000000001),
          costScale: new Decimal('e50'),
          scalingCostThreshold: new Decimal('1')
        });
    return k.getMaxBought(0, NullCycle(1).amount.mul('e750'), 1).quantity.add(7);
  }

  static bulkRequirement(bulk) { // add baseReq into it
    let amount = new Decimal(1e100).mul(Decimal.pow(1e25, Decimal.sub(bulk, 6)));

    if(Decimal.gt(bulk, 13)) amount = amount.pow(Decimal.sub(bulk, 13));

    return new ParallaxRequirement(1, amount);
  }

  static get parallaxes() {
    return player.celestials.null.parallax.floor();
  }

  static reset(){
    player.celestials.null.parallax = new Decimal(0);
  }

  static resetStuff(){
    if(!Parallax.requirement.isSatisfied) return;
    this.giveRewards();
    Currency.abyssalMatter.reset();
    NullCycles.reset();
    NullUpgrades.all.forEach(u => u.config.corrupt ? false : u.reset());
    Null.quotes.parallax1.show();
    if (player.celestials.null.parallax.gte(2)) Null.quotes.parallax2.show();
    if (player.celestials.null.parallax.gte(3)) Null.quotes.parallax3.show();
  }

  static giveRewards(){
    if (NullUpgrade(15).isUnlocked && player.celestials.null.parallax.lt(Parallax.bulkAmount)) player.celestials.null.parallax = Parallax.bulkAmount;
    else player.celestials.null.parallax = player.celestials.null.parallax.add(1);
  }
}
