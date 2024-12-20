import { DC } from "../../constants";

const rebuyableMul = props => {
  props.cost = () => getHybridCostScaling(
    player.meta.upgrades.rebuyable[props.id],
    1e50,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () => Decimal.pow( effect, player.meta.upgrades.rebuyable[props.id]);
  props.description = () => props.textTemplate.replace("{value}", format(effect, 2, 2));
  props.formatEffect = value => formatX(value, 2, 1);
  props.formatCost = value => format(value, 2, 1);
  return props;
};

const rebuyablePow = props => {
  props.cost = () => getHybridCostScaling(
    player.meta.upgrades.rebuyable[props.id],
    1e50,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () => Decimal.mul( effect, player.meta.upgrades.rebuyable[props.id]).add(1).max(1);
  props.description = () => props.textTemplate.replace("{value}", format(effect, 2, 2));
  props.formatEffect = value => formatPow(value, 2, 1);
  props.formatCost = value => format(value, 2, 1);
  return props;
};

export const metaFabricatorUpgrades = [
  rebuyableMul({
    name: "Amplifiers Charger",
    id: 1,
    initialCost: 1,
    costMult: 60,
    textTemplate: "All Reality Aplifiers are {value} times higher per-purchase",
    effect: 1.5
  }),
  rebuyablePow({
    name: "Dimensional Overclock",
    id: 2,
    initialCost: 1,
    costMult: 9,
    textTemplate: "ADs, IDs and TDs and a {value} power",
    effect: 0.3
  }),
  rebuyablePow({
    name: "Singularity Shifter",
    id: 3,
    initialCost: 1,
    costMult: 30,
    textTemplate: "You gain a {value} power to gamespeed",
    effect: 0.75
  }),
  rebuyableMul({
    name: "Maxium Overdue",
    id: 4,
    initialCost: 1,
    costMult: 120,
    textTemplate: "The Singularity cap is {value} times higher",
    effect: 2
  }),
  rebuyableMul({
    name: "Outer Force",
    id: 5,
    initialCost: 1,
    costMult: 20,
    textTemplate: "The Extreme-V Nerf is lowered by {value} times",
    effect: 1.4
  }),
  {
    name: "Acomplate",
    id: 6,
    cost: 1,
    description: "Rift Force is generated outside of Glitch's Reality",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Pasinacomplo",
    id: 7,
    cost: 2,
    description: "Always passively generate IP, EP and RM, Infinities and Eternities",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Sanctum",
    id: 8,
    cost: 2,
    description: "Teresa does not reset except for best AM which updates outside of thier Reality",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Memory Overflow",
    id: 9,
    cost: 2,
    description: "Increase Ra memory caps by 100 (cost scales more) and get autobuyers for them",
    effect: () => 100,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Post singularity",
    id: 10,
    cost: 3,
    description: "Start Metas with Lai'tela's Reality fully disablized",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Timeless",
    id: 11,
    cost: 3,
    description: "Nameless do not reset and gain bonus Tesseracts based on Metas. You also get a autobuyer for Tesseracts",
    effect: () => Currency.metas.value.div(5).pow(2.2),
    formatEffect: value => "+" + format(value,2,2)
  },
  {
    name: "Glitch-lite",
    id: 12,
    cost: 3,
    description: "Glitch Upgrades do not have there requirements reset",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Fall",
    id: 13,
    cost: 4,
    description: "Metas boost Meta Relay gain",
    effect: () => Currency.metas.value.pow(1.44).div(15).add(1).min(1e10), // just in case of someone getting alot (we don't need that much yet)
    formatEffect: value => format(value)
  },
  {
    name: "Insert Meme Here",
    id: 14,
    cost: 4,
    description: "V Achievements do not reset (unless you reset Extreme)",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Softcapn't",
    id: 15,
    cost: 6,
    description: "Change alot of softcaps",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Automagicly",
    id: 16,
    cost: 8,
    description: "Unlock autobuyers for single purchase Reality and Imaginary upgrades",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Alchemicaly",
    id: 17,
    cost: 8,
    description: "All Alchemy resorces are always caped and Shifter effects Chaos Dimensions",
    effect: () => AlchemyResource.shifter.effectOrDefault(1),
    formatEffect: value => formatX(value, 2),
  },
  {
    name: "Perky",
    id: 18,
    cost: 12,
    description: "Keep all perks",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Glitchy",
    id: 19,
    cost: 25,
    description: "Unlock Glitch upgrade autobuyers",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Spacous Generator",
    id: 20,
    cost: 80,
    description: "Generate Space Theorems based on Metas (caps at 25000)",
    effect: () => Currency.metas.value.pow(1.2).div(60),
    formatEffect: value => format(value, 2, 2) + "/s"
  },
  {
    name: "Meta Charger",
    id: 21,
    cost: 1e6,
    description: "Game more Metas based on Metas",
    effect: () => Currency.metas.value.div(60).pow(0.5).add(1),
    formatEffect: value => format(value, 2, 2)
  },
  {
    name: "Nu uh",
    id: 22,
    cost: 5e6,
    description: "Chaos Dimensions only reset their amount",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Be gone Hardcap",
    id: 23,
    cost: 2e9,
    description: "Increase the Antimatter hardcap based on Metas",
    effect: () => Currency.metas.value.div(15).pow(2.5).add(1).min(1e50),
    formatEffect: value => formatPow(value,2,2),
  },
  {
    name: "Some pointless stuff",
    id: 24,
    cost: 1e12,
    description: "Unlock autobuyers for Singularity cap, Keep Charged Infinity upgrades and Ra memory level",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
  {
    name: "Forgeting someone?",
    id: 25,
    cost: 1e18,
    description: "Unlock 2 Ra memories for Cante and Null",
    effect: () => 1,
    formatEffect: value => "",
    noLabel: true
  },
];
