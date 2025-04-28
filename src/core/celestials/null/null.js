import { GameDatabase } from "../../secret-formula/game-database";
import { Quotes } from "../quotes";

export const Null = {
  displayName: "Null",
  possessiveName: "Null's",
  get isTabUnlocked() {
    if(this.isCorrupt) return (player.celestials.null.isUnlocked & 1 << 6) > 0
    return (player.celestials.null.isUnlocked & ( 1 << player.celestials.null.parallax.min(5).toNumber())) > 0;
  },

  get isUnlocked() {
    return Ra.unlocks.nullUnlock.isUnlocked;
  },

  get isCorrupt() {
    return Corrupt.corrupts.gt(0);
  },

  get passcode() {
    return GameDatabase.celestials.null.passcode;
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
  symbol: "Θ",

  reset(){
    const N = player.celestials.null;
  },

};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if(Tab.meta.NullTab.isOpen) Null.quotes.show.show();
});