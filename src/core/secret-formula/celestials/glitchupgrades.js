import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.celestials.glitch.upgrades.rebuyable[props.id],
    1e50,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () =>  props.id == 3 ? (effect * player.celestials.glitch.upgrades.rebuyable[props.id]) : Decimal.pow( (typeof effect == "function") ? effect() : effect ,player.celestials.glitch.upgrades.rebuyable[props.id]);
  props.description = () => props.id == 3 ? props.textTemplate.replace("{value}", "+" + format(effect)) : props.textTemplate.replace("{value}", formatX( (typeof effect == "function") ? effect() : effect , 2, 2));
  props.formatEffect = value => props.id == 3 ? ("+" + format(value, 2, 2)) : formatX(value, 2, 2);
  props.formatCost = value => format(value, 2, 2);
  return props;
};


export const glitchRealityUpgrades = [
  rebuyable({
    name: "Rift OverDrive",
    id: 1,
    initialCost: 1,
    costMult: 20,
    textTemplate: "You gain {value} more Rift Force",
    effect: () => ((GlitchRealityUpgrades.all[12].isBought ? 2.5 : 2) * GlitchRealityUpgrades.all[13].effectOrDefault(1))
  }),
  rebuyable({
    name: "Glyph ForcedOver",
    id: 2,
    initialCost: 5,
    costMult: 40,
    textTemplate: "Glyph Sacrifice is {value} times higher, also some effects are increased past 1e300",
    effect: 1e10
  }),
  rebuyable({
    name: "Rifting refinement",
    id: 3,
    initialCost: 100,
    costMult: 50,
    textTemplate: "Glyph Refinement cap is {value} higher",
    effect: 250
  }),
  rebuyable({
    name: "CosmicFlight",
    id: 4,
    initialCost: 15,
    costMult: 32,
    textTemplate: "You gain {value} more Singularitys",
    effect: 5
  }),
  {
    name: "augmented Infinity",
    id: 5,
    cost: 30,
    requirement: "Reach Infinity (all effects)",
    hasFailed: () => !(Glitch.activeAugments.length >= 9),
    checkRequirement: () => player.infinities.gt(0) && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    description: "Rift Force multiplies ADs uneffected by Celestial Reality's or Dilation but nerfed while Doomed (comes back based on RS)",
    effect: () =>  {
      let effect = Currency.riftForce.value.pow(Currency.riftForce.value.log(1.5) ** 2).max(1);
      if(effect.gt("1e1E12")) effect = effect.pow( 1 / ( (effect.log10() / 1e12) ** 0.7) );

      return effect;
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "augmentation of IP",
    id: 6,
    cost: 100,
    requirement: () => `Infinity for ${format("1.8e308",2,2)} Infinity Points (all effects)`,
    hasFailed: () => !(Glitch.activeAugments.length >= 9),
    checkRequirement: () => Currency.infinityPoints.gte("1.8e308") && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    description: "While Augmented, Laitela's max Dimension count is one higher",
    effect: () =>  1,
    formatEffect: value => ("+" + format(value))
  },
  {
    name: "Reinforcement",
    id: 7,
    cost: 10000,
    requirement: () => `Reach ${format("1e1E13")} Antimatter with Teresa, Nameless One's Dim limit and Lai'tela active`,
    hasFailed: () => player.celestials.glitch.augment.effectbits != 265,
    checkRequirement: () => Currency.antimatter.gte("1e1E13") && Glitch.isRunning && player.celestials.glitch.augment.effectbits == 265,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You only are forced to have 4 Cursed Glyphs",
    effect: () =>  1,
    formatEffect: value => ("+" + format(value))
  },
  {
    name: "Uncounted Forces",
    id: 8,
    cost: 1e6,
    requirement: () => `Reach ${format("1e1E9")} Antimatter with Ra no DimBoosts and Lai'tela active`,
    hasFailed: () => Glitch.augmentEffectBits != 320,
    checkRequirement: () => Currency.antimatter.gte("1e1E9") && Glitch.isRunning && Glitch.augmentEffectBits == 320,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You start with 5 DimBoosts and Lai'tela Reality at 10 minutes",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Lai'tela Rebound",
    id: 9,
    cost: 1e8,
    requirement: () => `Reach ${format("1e4E6")} Antimatter (all effects)`,
    hasFailed: () => Glitch.activeAugments.length < 9,
    checkRequirement: () => Currency.antimatter.gte("1e4E6") && Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "infinity dimensions are not effected by lai'tela",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Cosmic Reconstructor",
    id: 10,
    cost: 1e13,
    requirement: () => `Reach ${format("1e1.66E9", 2, 2)} Antimatter with Effarig, Nameless one's Dim limit, and both Ra effects active`,
    hasFailed: () => Glitch.augmentEffectBits != 202,
    checkRequirement: () => Currency.antimatter.gte("1e1.66E9") && Glitch.isRunning && Glitch.augmentEffectBits == 202,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "You start with default Currencys (IP, EP and Eternities)",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Unaligned",
    id: 11,
    cost: 1e15,
    requirement: () => `Reach ${format("1e5E10")} Antimatter with Teresa Reality, Effarig Reality, Nameless one's Reality, Nameless one's, dim limit, Nameless one's low tachyon gain, and V's Reality active`,
    hasFailed: () => Glitch.augmentEffectBits != 63,
    checkRequirement: () => Currency.antimatter.gte("1e5E10") && Glitch.isRunning && Glitch.augmentEffectBits == 63,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Game speed from Black holes are always in effect while Augmented",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Overdrive",
    id: 12,
    cost: 1e17,
    requirement: () => `Reach Reality with Nameless one's low tachyon gain, Ra's no DimBoost, Ra's static tickspeed, and Lai'tela's Reality`,
    hasFailed: () => Glitch.augmentEffectBits != 464,
    checkRequirement: () => player.dilation.studies.includes(6) && Glitch.isRunning && Glitch.augmentEffectBits == 464,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Teresa Sacrifice is powered by 1.5 and DMDs have a 2.5 power and Singulatity gain power of 1.25",
    effect: () =>  1,
    formatEffect: value => "^1.5, ^2.5, ^1.25"
  },
  {
    name: () => (GlitchRealityUpgrades.all[12].isAvailableForPurchase ? "The Darkness Arizes" : "Locked") ,
    id: 13,
    cost: 1e23,
    requirement: () => `Reach ${format("1e1E9")} Antimatter with all but Nameless One's Reality`,
    hasFailed: () => Glitch.augmentEffectBits != 507,
    checkRequirement: () =>  Currency.antimatter.gte("1e1E9") && Glitch.isRunning && Glitch.augmentEffectBits == 507,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Rift Force gain is squared, Rift OverDrive effect changed from 2 to 2.5 per upgrade, Augmented Infinity is cubed",
    effect: () =>  1,
    formatEffect: value => "^2, +0.5, ^3"
  },
  {
    name: () => (GlitchRealityUpgrades.all[13].isAvailableForPurchase ? "The Darkness Overcomes" : "Locked"),
    id: 14,
    cost: 1e145,
    requirement: () => `Reach ${format("1e2E15")} Antimatter with Effarig Reality, Nameless one's Dim limit and low tachyon gain, V's Reality and Lai'tela's Reality (also requires ${GlitchRealityUpgrades.all[12].name})`,
    hasFailed: () => !GlitchRealityUpgrades.all[12].isBought || Glitch.augmentEffectBits != 314,
    checkRequirement: () =>  GlitchRealityUpgrades.all[12].isBought && Currency.antimatter.gte("1e2E15") && Glitch.isRunning && Glitch.augmentEffectBits == 314,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Riftoverdrive effect is doubled, glyphs softcap 3 (at 100k)is disabled",
    effect: () =>  2,
    formatEffect: value => "x2, Glyph softcap 3 is disabled"
  },
  {
    name: () => (GlitchRealityUpgrades.all[14].isAvailableForPurchase ? "The Darkness Is Coming" : "Locked"),
    id: 15,
    cost: new Decimal("1e400"),
    requirement: () => `Reach ${format("1e500E15")} Antimatter (also requires ${GlitchRealityUpgrades.all[13].name})`,
    hasFailed: () => !GlitchRealityUpgrades.all[13].isBought || Glitch.augmentEffectBits != 0,
    checkRequirement: () =>  GlitchRealityUpgrades.all[13].isBought && Currency.antimatter.gte("1e500E15") && Glitch.isRunning && Glitch.augmentEffectBits == 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "2 less forced Cursed Glyphs",
    effect: () =>  2,
    formatEffect: value => "-2"
  },
  {
    name: () => (GlitchRealityUpgrades.all[15].isAvailableForPurchase ? "The Darkness Has Arrived" : "Locked"),
    id: 16,
    cost: new Decimal("4.44e444"),
    requirement: () => `Reach ${format("1.8e308")} Projected RM all effects excluding Ra's and Nameless One's Reality (also requires ${GlitchRealityUpgrades.all[14].name})`,
    hasFailed: () => !GlitchRealityUpgrades.all[14].isBought || Glitch.augmentEffectBits != 315,
    checkRequirement: () =>  GlitchRealityUpgrades.all[14].isBought && MachineHandler.gainedRealityMachines.times(simulatedRealityCount()).gte("1.8e308") && Glitch.isRunning && Glitch.augmentEffectBits == 315,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Glitch stays complete past Pelle and unlock Glitch's second layer after beating Pelle, also ADs are powered by 2.5",
    effect: () =>  1.5,
    formatEffect: value => (GlitchRealityUpgrades.all[15].isBought ? "Unlocked" : "Locked, ^2.5 AD")
  },
];
