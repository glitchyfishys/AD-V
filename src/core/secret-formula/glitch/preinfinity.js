
export const preInfinityUG = [
  {
    name: "Dimless",
    id: 0,
    requirement: () => `Reach ${format(1e15)} Antimatter without any Dimension Boosts, no galaxies (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts != 0 || player.galaxies > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 15 && player.dimensionBoosts == 0 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "AD multiplier from Dimension Boosts",
    effect: () => 1 + player.dimensionBoosts / 4,
    formatEffect: value => formatX(value, 2, 2),
  },
  {
  name: "Dimensional Limits",
    id: 1,
    requirement: () => `Have ${format(1e25)} Antimatter with only one Dimension Boost, no Galaxies (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts > 1 || player.galaxies > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 25 && player.dimensionBoosts <= 1 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "AD multiplier from Tickspeed purchases",
    effect: () => 1 + Tickspeed.totalForEffect / 15,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Vector 2",
    id: 2,
    requirement: () => `Have ${format(1e35)} Antimatter with upto two Dimension Boosts, no galaxies (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts > 2 || player.galaxies > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 35 && player.dimensionBoosts <= 2 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "25x AD multiplier oscillating over 10 seconds",
    effect: () => Math.max(Math.abs(Math.sin(player.records.realTimePlayed /10000) ) * 25,1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "8th dimensional",
    id: 3,
    requirement: () => `Have ${format(1e50)} Antimatter with upto four Dimension Boosts, no Galaxies and only one of each Dimension tier (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts > 4 || player.galaxies > 0 || PlayerProgress.infinityUnlocked() || AntimatterDimensions.all.some(ad => ad.bought > 1),
    checkRequirement: () => player.antimatter.e >= 50 && player.dimensionBoosts <= 4 && player.galaxies == 0 && !PlayerProgress.infinityUnlocked() && AntimatterDimensions.all.some(ad => ad.bought < 2),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "1st AD multiplier by the amount of 8th AD",
    effect: () => Decimal.pow(1.1, AntimatterDimension(8).bought).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Galatic Inforcement",
    id: 4,
    requirement: () => `Have ${format(1e7)} Antimatter with no Dimension Boosts, one Galaxy, up to ten 2nd Dimentsions (pre-Infinity)`,
    hasFailed: () => player.dimensions.antimatter[1].amount.gt(10) || player.galaxies > 1 || player.dimensionBoosts > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 7 && !player.dimensions.antimatter[1].amount.gt(20) && player.galaxies <= 1 && !player.dimensionBoosts > 0 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "additonal Tickspeed purchases by their amount",
    effect: () => Math.floor(Math.log2(Tickspeed.totalForEffect + 2) ** 2) - 1,
    formatEffect: value => "+" + formatInt(value)
  },
  {
    name: "Galatic Limitaion",
    id: 5,
    requirement: () => `Have ${format(1e25)} Antimatter with no Dimension Boosts, one Galaxy, up to 20 4th Dimentsions (pre-Infinity)`,
    hasFailed: () => player.dimensions.antimatter[3].amount.gt(20) || player.galaxies > 1 || player.dimensionBoosts > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 25 && !player.dimensions.antimatter[3].amount.gt(20) && player.galaxies <= 1 && !player.dimensionBoosts > 0 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "additonal Tickspeed purchases based on Dimension Boosts and Galaxies",
    effect: () => Math.floor(Math.log2(player.dimensionBoosts * player.galaxies + 1) ** 1.75),
    formatEffect: value => "+" + formatInt(value)
  },
  {
    name: "Galatic Capacity",
    id: 6,
    requirement: () => `reach ${format(Number.MAX_VALUE, 2)} Antimatter with only one Antimatter Galaxy (pre-Infinity)`,
    hasFailed: () => player.galaxies > 1 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.gt(1.79e308) && player.galaxies <= 1 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "double infinity point gain",
    effect: () => 2,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "galatic instance",
    id: 7,
    requirement: () => `have ${format(3)} Antimatter Galaxies without Infinity broken (pre-Break)`,
    hasFailed: () => PlayerProgress.hasBroken(),
    checkRequirement: () => player.galaxies >= 3 && !PlayerProgress.hasBroken(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "double infinity point gain",
    effect: () => 2,
    formatEffect: value => formatX(value, 2, 2)
  },
  
];
