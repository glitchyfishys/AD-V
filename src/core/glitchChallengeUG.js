import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";


class preInfinityUGState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
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
    return Currency.antimatter;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.glitch.preinfinity.upgradebits;
  }

  set bits(value) {
    player.glitch.preinfinity.upgradebits = value;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }
  
  get isAvailableForPurchase() {
    return (player.glitch.preinfinity.upgradebits & (1 << this.id)) !== 0;
  }

  get isUseless() {
    if(typeof this.config.isUseless != "undefined") return (this.config.isUseless() && Pelle.isDoomed)
    return false;
  }
  
  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.glitch.preinfinity.upgradebits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked glitched Upgrade: ${this.config.name}`);
  }

  onPurchased() {
    const id = this.id;
    console.log(id)
  }
}

preInfinityUGState.index = mapGameData(
  GameDatabase.glitch.preInfinityUG,
  config => (new preInfinityUGState(config))
);

export const preInfinityUG = id => preInfinityUGState.index[id];

export const preInfinityUGs = {
  all: preInfinityUGState.index.compact(),
  get allBought() {
    return (player.glitch.preinfinity.upgradebits >> 1) + 1 === 1 << (GameDatabase.glitch.preInfinityUG.length - 1);
  }
};


class breakInfinityUGState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
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
    return Currency.antimatter;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.glitch.breakinfinity.upgradebits;
  }

  set bits(value) {
    player.glitch.breakinfinity.upgradebits = value;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }
  
  get isAvailableForPurchase() {
    return (player.glitch.breakinfinity.upgradebits & (1 << this.id)) !== 0;
  }

  get isUseless() {
    if(typeof this.config.isUseless != "undefined") return (this.config.isUseless() && Pelle.isDoomed)
    return false;
  }
  
  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.glitch.breakinfinity.upgradebits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked glitched Upgrade: ${this.config.name}`);
  }

  onPurchased() {
    const id = this.id;
    console.log(id)
  }
}

breakInfinityUGState.index = mapGameData(
  GameDatabase.glitch.breakInfinityUG,
  config => (new breakInfinityUGState(config))
);

export const breakInfinityUG = id => breakInfinityUGState.index[id];

export const breakInfinityUGs = {
  all: breakInfinityUGState.index.compact(),
  get allBought() {
    return (player.glitch.breakinfinity.upgradebits >> 1) + 1 === 1 << (GameDatabase.glitch.breakInfinityUG.length - 1);
  }
};


class eternityUGState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
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
    return Currency.antimatter;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.glitch.eternity.upgradebits;
  }

  set bits(value) {
    player.glitch.eternity.upgradebits = value;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }
  
  get isAvailableForPurchase() {
    return (player.glitch.eternity.upgradebits & (1 << this.id)) !== 0;
  }

  get isUseless() {
    if(typeof this.config.isUseless != "undefined") return (this.config.isUseless() && Pelle.isDoomed)
    return false;
  }
  
  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.glitch.eternity.upgradebits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked glitched eternity Upgrade: ${this.config.name}`);
  }

  onPurchased() {
    const id = this.id;
    console.log(id)
  }
}

eternityUGState.index = mapGameData(
  GameDatabase.glitch.eternityUG,
  config => (new eternityUGState(config))
);

export const eternityUG = id => eternityUGState.index[id];

export const eternityUGs = {
  all: eternityUGState.index.compact(),
  get allBought() {
    return (player.glitch.eternity.upgradebits >> 1) + 1 === 1 << (GameDatabase.glitch.eternityUG.length - 1);
  }
};

class realityUGState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
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
    return Currency.antimatter;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.glitch.reality.upgradebits;
  }

  set bits(value) {
    player.glitch.reality.upgradebits = value;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }
  
  get isAvailableForPurchase() {
    return (player.glitch.reality.upgradebits & (1 << this.id)) !== 0;
  }

  get isUseless() {
    if(typeof this.config.isUseless != "undefined") return (this.config.isUseless() && Pelle.isDoomed)
    return false;
  }
  
  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.glitch.reality.upgradebits |= (1 << this.id);
    GameUI.notify.error(`You've unlocked glitched reality Upgrade: ${this.config.name}`);
  }

  onPurchased() {
    const id = this.id;
    console.log(id)
  }
}


realityUGState.index = mapGameData(
  GameDatabase.glitch.realityUG,
  config => (new realityUGState(config))
);

export const realityUG = id => realityUGState.index[id];

export const realityUGs = {
  all: realityUGState.index.compact(),
  get allBought() {
    return (player.glitch.reality.upgradebits >> 1) + 1 === 1 << (GameDatabase.glitch.realityUG.length - 1);
  }
};
