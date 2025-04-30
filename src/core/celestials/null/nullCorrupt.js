class CorruptRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return Parallax.parallaxes.gte(Decimal.floor(this.amount));
  }
}

export class Corrupt {
  static get boost() {
    let boost = new Decimal(4);
    return boost;
  }

  static get powBoost() {
    let boost = new Decimal(0.1);
    return boost;
  }

  static get power() {
    const mult = new Decimal(Corrupt.powBoost).mul(this.corrupts).add(1);
    return mult;
  }

  static get multiplier() {
    const mult = Corrupt.boost.pow(this.corrupts).clampMin(1);
    return mult;
  }

  static get canBeBought() {
    return true;
  }

  static baseRequirement = [14, 16, 18, 20, 25, 40, 50, 80];

  static get requirement() {
    if(Corrupt.baseRequirement[Corrupt.corrupts] != undefined) return new CorruptRequirement(1, Corrupt.baseRequirement[Corrupt.corrupts]);
    return Corrupt.bulkRequirement(Corrupt.corrupts.add(1));
  }

  static bulkRequirement(bulk) { // add baseReq into it
    let amount = new Decimal(80).add(Decimal.sub(bulk,3).pow(2));

    return new CorruptRequirement(1, amount);
  }

  static get corrupts() {
    return player.celestials.null.corrupt.floor();
  }

  static resetStuff(){
    if(!Corrupt.requirement.isSatisfied) return;
    Parallax.reset();
    Currency.abyssalMatter.reset();
    NullCycles.reset();
    NullUpgrades.all.forEach(u => u.config.corrupt ? false : u.reset());
    player.celestials.null.corrupt = player.celestials.null.corrupt.add(1);
    Null.quotes.outrage.show();
  }

}
