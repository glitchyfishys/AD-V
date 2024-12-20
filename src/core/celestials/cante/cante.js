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
