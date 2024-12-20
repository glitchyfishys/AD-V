import { GameDatabase } from "../../secret-formula/game-database";
import { Quotes } from "../quotes";
import { GlitchRifts } from "./glitchrift";

export const Glitch = {
  displayName: "Glitch",
  possessiveName: "Glitch's",
  get isUnlocked() {
    return GlitchRifts.gamma.milestones[5].effectOrDefault(0) == 0 ? false : true;
  },

  augmentEffectActive(id = 0, force = false){
    if(!this.isRunning && !force) return false;
    return (player.celestials.glitch.augment.effectbits & (1 << id)) > 0;
  },

  get augmentEffectBits(){
    return player.celestials.glitch.augment.effectbits;
  },

  augmentEffects(id = 0){
      if(id == 0) return "Teresa Reality";
      if(id == 1) return "Effarig Reality";
      if(id == 2) return "Nameless one's Reality";
      if(id == 3) return "Nameless one's dim limit";
      if(id == 4) return "Nameless one's low tachyon gain";
      if(id == 5) return "V's Reality";
      if(id == 6) return "Ra's no dim boost";
      if(id == 7) return "Ra's static tickspeed";
      if(id == 8) return `Lai'tela's Reality (at ${this.laitelamaxdim}dims)`;
      if(id == 9) return `timed decay`;
      return "out of range";
  },

  get activeAugments(){
      let effect = [];
      this.augmentEffectActive(0, true) ? effect.push("Teresa Reality") : undefined;
      this.augmentEffectActive(1, true) ? effect.push("Effarig Reality") : undefined;
      this.augmentEffectActive(2, true) ? effect.push("Nameless one's Reality") : undefined;
      this.augmentEffectActive(3, true) ? effect.push("Nameless one's dim limit") : undefined;
      this.augmentEffectActive(4, true) ? effect.push("Nameless one's low tachyon gain") : undefined;
      this.augmentEffectActive(5, true) ? effect.push("V's Reality") : undefined;
      this.augmentEffectActive(6, true) ? effect.push("Ra's no Dimension Boosts") : undefined;
      this.augmentEffectActive(7, true) ? effect.push("Ra's static tickspeed") : undefined;
      this.augmentEffectActive(8, true) ? effect.push(`Lai'tela's Reality at ${this.laitelamaxdim} max Dimensions`) : undefined;
      this.augmentEffectActive(9, true) ? effect.push(`timed decay`) : undefined;
      return effect;
  },

  get totalAugmentsActive(){
    return activeAugments().length;
  },
  
  get forceGlyphs(){
    return 5 - (GlitchRealityUpgrades.all[6].effectOrDefault(0) + GlitchRealityUpgrades.all[14].effectOrDefault(0));
  },

  initializeRun() {
    player.celestials.glitch.run = true;

    if(!GlitchRealityUpgrades.all[9].isBought) {
      Currency.eternityPoints.reset();
      Currency.infinityPoints.reset();
      Currency.eternities.reset();
      player.eternityUpgrades.clear();
      player.replicanti.unl=false;
      Currency.replicanti.bumpTo(1);
    }

    if(this.tier == 0){

      disChargeAll();
      const cga = this.forceGlyphs;
      if(Glyphs.active.filter(x => x == null ? false :(x.type == "cursed")).length < cga){
        Glyphs.unequipAll(true);
        for(let i=0;i<cga;i++) {
          if((Glyphs.inventory.filter(x => x == null ? false :(x.type == "cursed")).length + Glyphs.active.filter(x => x == null ? false :(x.type == "cursed")).length) < cga) Glyphs.addToInventory(GlyphGenerator.cursedGlyph());
        };
        for(let i=0;i<cga;i++) {
          Glyphs.equip(player.reality.glyphs.inventory.filter(x=> x.type == "cursed")[0],Glyphs.active.indexOf(null));
        };
        player.reality.glyphs.undo=[];
      }
      
      
      this.augmentEffectActive(0) ? player.celestials.teresa.run = true : undefined;
      this.augmentEffectActive(1) ? player.celestials.effarig.run = true : undefined;
      this.augmentEffectActive(2) ? player.celestials.enslaved.run = true : undefined;
      this.augmentEffectActive(5) ? player.celestials.v.run = true : undefined;
      this.augmentEffectActive(8) ? player.celestials.laitela.run = true : undefined;
    }
    if(this.tier == 1){
      
    }
  },
  
  leaveRun() {
  
    for(let i=1; i<7;i++)player.eternityUpgrades.add(i);
    player.replicanti.unl=true;
    
    player.celestials.glitch.run = false;
    player.celestials.teresa.run = false;
    player.celestials.effarig.run = false;
    player.celestials.enslaved.run = false;
    player.celestials.v.run = false;
    player.celestials.ra.run = false;
    player.celestials.laitela.run = false;
    Glyphs.unequipAll(true);

    if (Ra.totalCharges >= 12) player.celestials.ra.charged = new Set([
    "timeMult2",
    "dimMult",
    "timeMult",
    "18Mult",
    "27Mult",
    "unspentBonus",
    "resetMult",
    "45Mult",
    "36Mult",
    "resetBoost",
    "galaxyBoost",
    "passiveGen"
]);
    
  },

  get riftForce(){
    return player.celestials.glitch.riftForce;
  },

  set riftForce(value){
    player.celestials.glitch.riftForce = new Decimal(value);
  },

  get chaosCores(){
    return player.celestials.glitch.chaosCores;
  },

  set chaosCores(value){
    player.celestials.glitch.chaosCores = new Decimal(value);
  },

  get riftForceGain(){
    if((!this.isRunning || this.activeAugments.length < 9) && (!MetaFabricatorUpgrade(6).isBought || Pelle.isDoomed) ) return new Decimal(0);

    function form (value) {return (GlitchSpeedUpgrades.all[2].isBought ? (value.log10() ** 0.2) : Decimal.log10(Decimal.log10(value)))};
    
    const AM = form(Currency.antimatter.value) ** 1.25;
    const IP = form(Currency.infinityPoints.value)** 2;
    const EP = form(Currency.eternityPoints.value) ** 3.5;
    let total = ((isNaN(AM) || AM == Infinity || AM < 1) ? 1 : AM) * ((isNaN(IP) || IP == Infinity || IP < 1) ? 1 : IP) * ((isNaN(EP) || EP == Infinity || EP < 1)? 1 : EP);

    GlitchRealityUpgrades.all[12].isBought ? total = (total ** 2) : total;
    
    if(total > 200) total = total * ((total /200) ** 1.25);
    let value = new Decimal(total / 24).times(GlitchRealityUpgrades.all[0].effectOrDefault(1)).pow( total > 24 ? 3.33 : 1);
    if(value.gt("1e450") && player.records.fullGameCompletions > 0) value = value.mul( new Decimal(Decimal.log10(value)).pow(25));
    
    const CC = Currency.chaosCores.value.mul(Currency.chaosCores.value.log(2)).pow(5).max(1);

    value = value.mul(CC);

    if(value.gt("1e1E6")) value = value.pow( 1 / (((value.log10() / 1e6) ** 0.8)));

    return value
  },

  get chaosCoresBoost(){
    if(Currency.chaosCores.eq(0) || V.isRunningExtreme) return new Decimal(1);
    let eff = Decimal.max( Currency.chaosCores.value.pow(0.1).mul(Currency.chaosCores.value.log10()).pow(0.25), 1);
    if(Ra.unlocks.repAD.isUnlocked) eff = eff.pow(0.05);
    if(eff.gt(1e15)) eff = eff.div(eff.div(1e15).pow(0.9))
    if(Pelle.isDoomed) eff = eff.pow(0.1);
    return eff.min(1e50);
  },

  riftToCore(){
    if(this.riftForce.lt(10)) return;
    Currency.chaosCores.add(Currency.riftForce.value.log(5) ** 0.35);
    Currency.riftForce.value = new Decimal(0);
  },

  get riftToCoreGain(){
    if(this.riftForce.lt(10)) return "0";
    return format(Currency.riftForce.value.log(5) ** 0.35, 2);
  },

  get laitelamaxdim(){
    return Math.min(5 + GlitchRealityUpgrades.all[5].effectOrDefault(0),8);
  },
  get decay(){
    if(!this.augmentEffectActive(9)) return 1;
    return Math.pow(2, Math.max(Time.thisRealityRealTime.totalSeconds.toNumber() / 30 , 0));
  },
  
  get ADnerf(){
    return (this.augmentEffectActive(9) ? (0.95 / this.decay) : 0.95);
  },
  get IDnerf(){
    return (this.augmentEffectActive(9) ? (0.15 / this.decay) : 0.15);
  },
  get TDnerf(){
    return (this.augmentEffectActive(9) ? (0.3 / this.decay) : 0.3);
  },
  
  get description() {
    return GameDatabase.celestials.descriptions[6].effects()
  },
  get tier(){
    return player.celestials.glitch.tier;
  },
  get isRunning() {
    return player.celestials.glitch.run;
  },
  quotes: Quotes.glitch,
  symbol: "ὼ",

  reset(){
    const G = player.celestials.glitch;

    G.augment.effectbits = 0;
    G.upgrades
    Currency.chaosCores.reset()
    Currency.riftForce.reset()

    if(!MetaFabricatorUpgrade(12).isBought){
      G.upgrades.unlockbits = 0;
      G.upgrades.speedunlockbits = 0;
    }

    G.upgrades.broughtbits = 0;
    G.upgrades.speedbroughtbits = 0;
    G.upgrades.rebuyable = [0,0,0,0,0];

    if(MetaMilestone.glyphKeep.isReached) return;
    player.glitch.preinfinity.upgradebits = 0;
    player.glitch.breakinfinity.upgradebits = 0;
    player.glitch.eternity.upgradebits = 0;
    player.glitch.reality.upgradebits = 0;
  },

};

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => {
  if(player.records.fullGameCompletions == 0) Glitch.quotes.start.show();
});

EventHub.logic.on(GAME_EVENT.DIMBOOST_AFTER, () => {
  Glitch.quotes.dimBoost.show();
});

EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  if(AntimatterDimension(8).amount.gt(0)) Glitch.quotes.dimEight.show();
});
EventHub.logic.on(GAME_EVENT.GALAXY_RESET_AFTER, () => {
  Glitch.quotes.galaxy.show();
});

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_AFTER, () => {
  Glitch.quotes.infinity.show();
});

EventHub.logic.on(GAME_EVENT.BREAK_INFINITY, () => {
  Glitch.quotes.break.show();
});

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_AFTER, () => {
  Glitch.quotes.eternity.show();
});

EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => {
  Glitch.quotes.reality.show();
});

EventHub.logic.on(GAME_EVENT.ACHIEVEMENT_UNLOCKED, () => {
  if(Achievement(147).isUnlocked) Glitch.quotes.celestials.show();
});

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if(Tab.celestials.glitch.isOpen) Glitch.quotes.glitchReality.show();
});

EventHub.logic.on(GAME_EVENT.META_RESET_AFTER, () => {
  Glitch.quotes.goMeta.show();
});