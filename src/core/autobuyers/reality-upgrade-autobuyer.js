import { AutobuyerState } from "./autobuyer";

export class RealityUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return RealityUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.realityUpgrades.all[this.id - 1];
  }

  get isUnlocked() {
    return Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const upg = RealityUpgrade(this.id);
    var max = 0
    while (Currency.realityMachines.gte(upg.cost) && max < 500) {
      upg.purchase();
      max++;
    }
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Reality Upgrade"; }
  static get isActive() { return player.auto.realityUpgrades.isActive; }
  static set isActive(value) { player.auto.realityUpgrades.isActive = value; }
}
