import { BitUpgradeState } from "../../game-mechanics";
import { GameDatabase } from "../../secret-formula/game-database";


class NullUpgradeState extends BitUpgradeState {
  get bits() { return player.celestials.null.upgradeBits; }
  set bits(value) { player.celestials.null.upgradeBits = value; }

  get cost() {
    return this.config.cost;
  }

  get isEffectActive() {
    return true;
  }

  purchase() {
    if(this.config.corrupt){
      if (this.isUnlocked || !Currency.corruptMatter.purchase(this.cost)) return;
    }
    else if (this.isUnlocked || !Currency.abyssalMatter.purchase(this.cost)) return;
    this.unlock();
    this.config.onPurchased?.();
  }
  
  reset(){
    if(this.isUnlocked) this.bits -= (1 <<this.id);
  }
}

export const NullUpgrades = mapGameDataToObject(
  GameDatabase.celestials.null.upgrades,
  config => new NullUpgradeState(config)
);

export const NullUpgrade = id => NullUpgrades.all[id];
