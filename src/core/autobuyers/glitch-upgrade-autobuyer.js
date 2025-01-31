import { AutobuyerState } from "./autobuyer";

export class GlitchUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return GlitchRealityUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.gup.all[this.id - 1];
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(19).isBought;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const upg = GlitchRealityUpgrade(this.id);
    upg.purchaseHybrid();
  }

  static get entryCount() { return 4; }
  static get autobuyerGroupName() { return "Glitch Upgrade"; }
  static get isActive() { return player.auto.gup.isActive; }
  static set isActive(value) { player.auto.gup.isActive = value; }
}

export class NonRepeatableGlitchUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nrgu;
  }

  get name() {
    return `Non-repeatable Glitch Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(19).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nrgu.isActive) {
    for (let i = 1; i <= 12; i++) {
      if (Currency.riftForce.gte(GlitchRealityUpgrade(i+4).cost) && !GlitchRealityUpgrade(i+4).isBought) {
        GlitchRealityUpgrade(i+4).purchase();
      }
      }
      for (let i = 1; i <= 4; i++) {
        if (Currency.riftForce.gte(GlitchSpeedUpgrade(i).cost) && !GlitchSpeedUpgrade(i).isBought) {
          GlitchSpeedUpgrade(i).purchase();
        }
      }
    }
  }
}