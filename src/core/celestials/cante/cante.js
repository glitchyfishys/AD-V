import { GameDatabase } from "../../secret-formula/game-database";
import { Quotes } from "../quotes";

export const Cante = {
  displayName: "Cante",
  possessiveName: "Cante's",
  get isUnlocked() {
    return false;
  },

  initializeRun() {
    player.celestials.cante.run = true;
  },
  
  leaveRun() {
    player.celestials.cante.run = false;
  },

  get repUnlocks(){
      return GameDatabase.celestials.cante.repUnlocks;
  },
  get unlockedReps(){
    return this.repUnlocks.filter(o => o.condition()).length;
  },

  get purged(){
    return this.purges > 0;
  },

  get purges(){
    return player.celestials.cante.purges;
  },

  get ADnerf(){
    return 1e-25;
  },
  get IDnerf(){
    return 0;
  },
  get TDnerf(){
    return 0;
  },
  
  get description() {
    return GameDatabase.celestials.descriptions[7].effects()
  },
  get isRunning() {
    return player.celestials.cante.run;
  },
  quotes: Quotes.cante,
  symbol: "ξ",

  reset(){
    const C = player.celestials.cante;
  },

};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if(Tab.meta.CanteTab.isOpen) Cante.quotes.show.show();
});