import { GameDatabase } from "../../secret-formula/game-database";
import { Quotes } from "../quotes";

export const Null = {
  displayName: "Null",
  possessiveName: "Null's",
  get isUnlocked() {
    return false;
  },

  initializeRun() {
    player.celestials.null.run = true;
  },
  
  leaveRun() {
    player.celestials.null.run = false;
  },

  get ADnerf(){
    return 1e-35;
  },
  get IDnerf(){
    return 1e-35;
  },
  get TDnerf(){
    return 1e-35;
  },
  
  get description() {
    return GameDatabase.celestials.descriptions[8].effects()
  },

  get isRunning() {
    return player.celestials.null.run;
  },

  quotes: Quotes.null,
  symbol: "0",

  reset(){
    const N = player.celestials.null;
  },

};
