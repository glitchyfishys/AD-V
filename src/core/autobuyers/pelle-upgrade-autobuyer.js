import { AutobuyerState } from "./autobuyer";

export class PelleUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.pelleUpgrades.all[this.id-1];
  }

  get name(){
          return ["Antimater Dimenions", "Game Speed", "Glyph Level", "ID Conversion Rate", "Galaxy Strength", "Single Purchase"][this.id-1];
      }

  get isUnlocked() {
    return ChallengerUpgrade(8).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.pelleUpgrades.isActive) {
      if (this.id == 6) PelleUpgrade.all.filter(x => typeof(x.id) == "number").forEach(x => {
        x.purchase();
      }); 
      else PelleUpgrade.all[this.id - 1].purchase();
    }
  }
    
  static get entryCount(){
      return 6;
  }

  static get autobuyerGroupName(){ return "Pelle Upgrades"; }
  static get isActive(){ return player.auto.pelleUpgrades.isActive; }
  static set isActive(value){ player.auto.pelleUpgrades.isActive = value; }
}
