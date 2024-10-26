import { AutobuyerState } from "./autobuyer";
import { GlyphSacrificeHandler, ImaginaryUpgrade, MendingMilestone, RealityUpgrade } from "../globals";

export class NonRepeatableImaginaryUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nriu;
  }

  get name() {
    return `Non-repeatable Imaginary Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(16).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nriu.isActive) {
    for (let i = 1; i <= 15; i++) {
    if (Currency.imaginaryMachines.gte(ImaginaryUpgrade(i+10).cost) && !ImaginaryUpgrade(i+10).isBought) {
      ImaginaryUpgrade(i+10).purchase();
      ImaginaryUpgrade(i+10).onPurchased();
    }
    }}
  }
}

export class NonRepeatableRealityUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nrru;
  }

  get name() {
    return `Non-repeatable Reality Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(16).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nrru.isActive) {
    for (let i = 1; i <= 20; i++) {
    if (Currency.realityMachines.gte(RealityUpgrade(i+5).cost) && !RealityUpgrade(i+5).isBought) {
      RealityUpgrade(i+5).purchase()
      RealityUpgrade(i+5).onPurchased()
    }
    }}
  }
}