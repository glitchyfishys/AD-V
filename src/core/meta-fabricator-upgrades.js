import { BitPurchasableMechanicState, RebuyableMechanicState, Effect } from "./game-mechanics";

class MetaUpgradeState extends BitPurchasableMechanicState {
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

  get currency() {
    return Currency.metaRelays;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.meta.upgrades.metaBits;
  }

  set bits(value) {
    player.meta.upgrades.metaBits = value;
  }

  onPurchased() {
    const id = this.id;

    if(id == 10) {
      player.celestials.laitela.difficultyTier = 8;
    }

    if(id == 12) {
      player.celestials.glitch.upgrades.unlockbits = 8388607;
      player.celestials.glitch.upgrades.speedunlockbits = 31;
    }

    if(id == 14){
      for (let i = 0; i < 10; i++) {
        player.celestials.v.runUnlocks[i] = VRunUnlocks.all[i].config.values.length;
      }
      V.updateTotalRunUnlocks();
    }

  }
}

class RebuyableMetaUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.metaRelays;
  }

  get boughtAmount() {
    return player.meta.upgrades.rebuyable[this.id];
  }

  set boughtAmount(value) {
    player.meta.upgrades.rebuyable[this.id] = value;
  }
}

MetaUpgradeState.index = mapGameData(
  GameDatabase.meta.metaFabricatorUpgrades,
  config => (config.id < 6
    ? new RebuyableMetaUpgradeState(config)
    : new MetaUpgradeState(config))
);

/**
 * @param {number} id
 * @return {MetaUpgradeState|RebuyableMetaUpgradeState}
 */
export const MetaFabricatorUpgrade = id => MetaUpgradeState.index[id];

export const MetaFabricatorUpgrades = {
  /**
   * @type {(MetaUpgradeState|RebuyableMetaUpgradeState)[]}
   */
  all: MetaUpgradeState.index.compact(),
  get allBought() {
    return (player.meta.upgrades.metaBits >> 0) + 1 === 1 << (GameDatabase.meta.metaFabricatorUpgrade.length - 5);
  }
};


export class MetaMilestoneState extends Effect{
  constructor(config) {
    super(config.effect);
    this.config = config;

  }

  get isReached() {
    return this.config.condition();
  }

}
export const MetaMilestone = mapGameDataToObject(
  GameDatabase.meta.metaMilestones,
  config => (new MetaMilestoneState(config))
);