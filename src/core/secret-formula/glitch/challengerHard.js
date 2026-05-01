import { DC } from "../../constants";

export const HardChallengerUpgrades = [
  {
    name: "The Challenger Arrives",
    id: 0,
    cost: new Decimal(100),
    description: "Challenger Essence multiplies it's own gain",
    effect: () =>  {
      return Currency.challengersEssence.value.add(3.5).log(3.5);
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "The Filament",
    id: 1,
    cost: new Decimal(200),
    description: () => `Galaxy Generator is ${format(DC.E50)} times faster and auto unlocks`,
    effect: () =>  DC.E50,
  },
  {
    name: "The Challenger Arrives",
    id: 2,
    cost: new Decimal(500),
    description: "Unlock Glitch's layer two upgrades",
  },
  {
    name: "Chaos for those",
    id: 3,
    cost: new Decimal(1e3),
    description: "Challenger Essence multiplier based on Chaos Cores",
    effect: () =>  {
      return Currency.chaosCores.value.add(3).log(3).pow(1.5);
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Chaos Chaos",
    id: 4,
    cost: new Decimal(5e4),
    description: "Chaos Dimenion multiplier based on Challenger Essence",
    effect: () =>  {
      return Currency.challengersEssence.value.add(7).log(7).pow(1.5);
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Flowing Time",
    id: 5,
    cost: new Decimal(1e6),
    description: "Chaos Dimenion multiplier based on Game speed",
    effect: () =>  {
      return GameCache.gameSpeed.value.add(5).log(5).pow(0.7);
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Dimension Boost",
    id: 6,
    cost: new Decimal(1e10),
    description: "Unlock Plynia, which reset Chaos Dimenions for a boost on them selves"
  },
  {
    name: "Yet Again",
    id: 7,
    cost: new Decimal(1e12),
    description: "Chaos Cores and Rift Force multiplies Challenger Essence",
    effect: () =>  {
      return Currency.riftForce.value.add(10).log10().mul(Currency.chaosCores.value.add(10).log10()).pow(1.25);
    },
    formatEffect: value => formatX(value, 2, 2)
  },
];
