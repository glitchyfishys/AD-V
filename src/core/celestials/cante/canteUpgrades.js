import { BitUpgradeState } from "../../game-mechanics";
import { GameDatabase } from "../../secret-formula/game-database";


class CanteUpgradeState extends BitUpgradeState {
  get bits() { return player.celestials.cante.upgradeBits; }
  set bits(value) { player.celestials.cante.upgradeBits = value; }

  get cost() {
    return this.config.cost;
  }

  get isEffectActive() {
    return true;
  }

  purchase() {
    if(this.config.chaos){
      if (this.isUnlocked || !Currency.chaosMatter.purchase(this.cost)) return;
      this.unlock();
      this.config.onPurchased?.();
    }
    else if (this.isUnlocked || !Currency.artificialMatter.purchase(this.cost)) return;
    this.unlock();
    this.config.onPurchased?.();
  }
  
  reset(){
    if(this.isUnlocked) this.bits -= (1 <<this.id);
  }
}

export const CanteUpgrades = mapGameDataToObject(
  GameDatabase.celestials.cante.upgrades,
  config => new CanteUpgradeState(config)
);