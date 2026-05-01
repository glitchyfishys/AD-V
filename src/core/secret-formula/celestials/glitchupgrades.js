import { DC } from "../../constants";

const rebuyable = props => {
  const hybrid = C => getHybridCostScaling(
    C,
    DC.E50,
    props.initialCost,
    props.costMult,
    props.costMult.div(10),
    DC.E309,
    DC.D3,
    props.initialCost.mul(props.costMult)
  );
  const { effect } = props;
  props.effect = () =>  props.id == 3 ? (player.celestials.glitch.upgrades.rebuyable[props.id].mul(effect)) : Decimal.pow( (typeof effect == "function") ? effect() : effect ,player.celestials.glitch.upgrades.rebuyable[props.id]);
  props.description = () => props.id == 3 ? props.textTemplate.replace("{value}", "+" + format(effect)) : props.textTemplate.replace("{value}", formatX( (typeof effect == "function") ? effect() : effect , 2, 2));
  props.formatEffect = value => props.id == 3 ? ("+" + format(value, 2, 2)) : formatX(value, 2, 2);
  props.formatCost = value => format(value, 2, 2);
  props.cost = () => hybrid(player.celestials.glitch.upgrades.rebuyable[props.id]);
  props.hybridCostScaling = hybrid;
  return props;
};


export const glitchRealityUpgrades = [
  rebuyable({
    name: "Rift OverDrive",
    id: 1,
    initialCost: DC.D1,
    costMult: DC.D20,
    textTemplate: "You gain {value} more Rift Force",
    effect: () => GlitchRealityUpgrades.all[13].effectOrDefault(DC.D1).mul(GlitchRealityUpgrades.all[12].isBought ? 2.5 : 2)
  }),
  rebuyable({
    name: "Glyph Forced Over",
    id: 2,
    initialCost: new Decimal(5),
    costMult: new Decimal(40),
    textTemplate: "The max Glyph Sacrifice is {value} times higher, also some effects are increased past 1e300",
    effect: 1e10
  }),
  rebuyable({
    name: "Rifting Refinement",
    id: 3,
    initialCost: new Decimal(100),
    costMult: new Decimal(45),
    textTemplate: "The Glyph Refinement cap is increased by {value}",
    effect: 250
  }),
  rebuyable({
    name: "Cosmic Flight",
    id: 4,
    initialCost: new Decimal(15),
    costMult: new Decimal(30),
    textTemplate: "You gain {value} more Singularities",
    effect: 5
  }),
  {
    name: "Augmented Infinity",
    id: 5,
    cost: 50,
    requirement: "Reach Infinity with all nine effects active",
    ReqBits: () => 511,
    hasFailed: () => !(Glitch.activeAugments.length >= 9),
    checkRequirement: () => player.infinities.gt(0) && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    description: "Rift Force multiplies ADs uneffected by Celestial Reality's or Dilation",
    effect: () =>  {
      let effect = Currency.riftForce.value.pow(Currency.riftForce.value.log(1.5).pow(2)).max(1);
      if(effect.gt("1e1E12")) effect = effect.pow(effect.log10().div(1e12).pow(0.7).recip());

      return effect;
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Augmentation of IP",
    id: 6,
    cost: 1e14,
    requirement: () => `Infinity for ${format(DC.E500)} Infinity Points with all nine effects active`,
    ReqBits: () => 511,
    hasFailed: () => !(Glitch.activeAugments.length >= 9),
    checkRequirement: () => Currency.infinityPoints.gte(DC.E500) && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    description: "While Augmented, Laitela's max Dimension count is one higher",
    effect: () =>  1,
  },
  {
    name: "Reinforcement",
    id: 7,
    cost: 1e16,
    requirement: () => `Reach ${format("e3.8e14")} Antimatter with Teresa and Lai'tela Realities, Nameless One's Dim limit`,
    ReqBits: () => 265,
    hasFailed: () => player.celestials.glitch.augment.effectbits != 265,
    checkRequirement: () => Currency.antimatter.gte("e3.8e14") && Glitch.isRunning && player.celestials.glitch.augment.effectbits == 265,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You are only forced to have 4 Cursed Glyphs",
    effect: () =>  1,
  },
  {
    name: "Uncounted Forces",
    id: 8,
    cost: 1e20,
    requirement: () => `Reach ${format("e30e12")} Antimatter with Ra no DimBoosts and Lai'tela's Reality`,
    ReqBits: () => 320,
    hasFailed: () => Glitch.augmentEffectBits != 320,
    checkRequirement: () => Currency.antimatter.gte("e30e12") && Glitch.isRunning && Glitch.augmentEffectBits == 320,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You start with 5 DimBoosts and Lai'tela's Reality at 10 minutes",
    effect: () =>  1,
  },
  {
    name: "Lai'tela Rebound",
    id: 9,
    cost: 1e22,
    requirement: () => `Reach ${format("e8e6")} Antimatter with all nine effects active`,
    hasFailed: () => !(Glitch.activeAugments.length >= 9),
    ReqBits: () => 511,
    checkRequirement: () => Currency.antimatter.gte("e8e6") && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Infinity Dimensions are not effected by lai'tela",
    effect: () =>  1,
  },
  {
    name: "Cosmic Reconstructor",
    id: 10,
    cost: 1e23,
    requirement: () => `Reach ${format("e1.2e12", 2, 2)} Antimatter with Effarig's Reality, Nameless one's Dim limit, and both Ra effects`,
    ReqBits: () => 202,
    hasFailed: () => Glitch.augmentEffectBits != 202,
    checkRequirement: () => Currency.antimatter.gte("e1.2e12") && Glitch.isRunning && Glitch.augmentEffectBits == 202,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You start with the default IP, EP and Eternities",
    effect: () =>  1,
  },
  {
    name: "Unaligned",
    id: 11,
    cost: 1e25,
    requirement: () => `Reach ${format("e7e14")} Antimatter with the First six effects active`,
    ReqBits: () => 63,
    hasFailed: () => Glitch.augmentEffectBits != 63,
    checkRequirement: () => Currency.antimatter.gte("e7e14") && Glitch.isRunning && Glitch.augmentEffectBits == 63,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Game speed from Black holes are always in full effect while Augmented",
    effect: () =>  1,
  },
  {
    name: "Overdrive",
    id: 12,
    cost: 1e45,
    requirement: () => `Reach Reality with, Teresa's, Effarig's, V's and Lai'tela's Realities, Nameless ones' low tachyon gain, and No dimboosts`,
    ReqBits: () => 371,
    hasFailed: () => Glitch.augmentEffectBits != 371,
    checkRequirement: () => player.dilation.studies.includes(6) && Glitch.isRunning && Glitch.augmentEffectBits == 371,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Teresa Sacrifice, DMDs and Singularities ^1.05",
    effect: () =>  1,
  },
  {
    name: () => (GlitchRealityUpgrades.all[12].isAvailableForPurchase ? "The Darkness Arizes" : "Unknown") ,
    id: 13,
    cost: 1e60,
    requirement: () => `Reach ${format("e1e12")} Antimatter with all but The Nameless One's Reality`,
    ReqBits: () => 507,
    hasFailed: () => Glitch.augmentEffectBits != 507,
    checkRequirement: () =>  Currency.antimatter.gte("e1e12") && Glitch.isRunning && Glitch.augmentEffectBits == 507,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Rift Force gain is squared, Rift OverDrive effect changed from 2 to 2.5 per upgrade, Augmented Infinity is cubed",
    effect: () =>  1,
  },
  {
    name: () => (GlitchRealityUpgrades.all[13].isAvailableForPurchase ? "The Darkness Overcomes" : "Unknown"),
    id: 14,
    cost: 1e200,
    requirement: () => `Reach ${format("e1.5e15")} Antimatter with Effarig Reality, Nameless one's Dim limit and low tachyon gain, V's Reality and Lai'tela's Reality (also requires ${GlitchRealityUpgrades.all[12].name})`,
    ReqBits: () => 314,
    hasFailed: () => !GlitchRealityUpgrades.all[12].isBought || Glitch.augmentEffectBits != 314,
    checkRequirement: () =>  GlitchRealityUpgrades.all[12].isBought && Currency.antimatter.gte("e1.5e15") && Glitch.isRunning && Glitch.augmentEffectBits == 314,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Rift Overdrive effect is doubled, Glyphs softcap 3 is at 1M",
    effect: () =>  DC.D2,
  },
  {
    name: () => (GlitchRealityUpgrades.all[14].isAvailableForPurchase ? "The Darkness Is Coming" : "Unknown"),
    id: 15,
    cost: new Decimal("1e400"),
    requirement: () => `Reach ${format("e22e24")} Antimatter, no augments (also requires ${GlitchRealityUpgrades.all[13].name})`,
    ReqBits: () => 0,
    hasFailed: () => !GlitchRealityUpgrades.all[13].isBought || Glitch.augmentEffectBits != 0,
    checkRequirement: () =>  GlitchRealityUpgrades.all[13].isBought && Currency.antimatter.gte("e22e24") && Glitch.isRunning && Glitch.augmentEffectBits == 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You have 2 less forced Cursed Glyphs",
    effect: () =>  2,
  },
  {
    name: () => (GlitchRealityUpgrades.all[15].isAvailableForPurchase ? "The Darkness Has Arrived" : "Unknown"),
    id: 16,
    cost: new Decimal("4.44e444"),
    requirement: () => `Reach ${format("1.8e308")} Projected RM with all effects excluding Ra's and Nameless One's Reality (also requires ${GlitchRealityUpgrades.all[14].name})`,
    ReqBits: () => 315,
    hasFailed: () => !GlitchRealityUpgrades.all[14].isBought || Glitch.augmentEffectBits != 315,
    checkRequirement: () =>  GlitchRealityUpgrades.all[14].isBought && MachineHandler.gainedRealityMachines.times(simulatedRealityCount()).gte("1.8e308") && Glitch.isRunning && Glitch.augmentEffectBits == 315,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock more challenger upgrades and ADs are powered by 1.25",
    effect: () =>  1.25,
  },
];
