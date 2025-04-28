import { AutobuyerState } from "./autobuyer";

export class NullUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nullUG;
  }

  get name() {
    return `Non-corrupt Null Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return NullUpgrade(16).isUnlocked;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nullUG.isActive) {
    for (let i = 0; i < 12; i++) {
      NullUpgrade(i).purchase();
    }}
  }
}
