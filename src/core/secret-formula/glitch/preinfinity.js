
export const preInfinityUG = [
  {
    name: "Dimless",
    id: 0,
    requirement: () => `Reach ${format(1e15)} antimater without any Dimension Boosts, no galaxies (pre-Infinity)`,
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
    requirement: () => `Have ${format(1e25)} antimatter with only one Dimension Boost, no galaxies (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts > 1 || player.galaxies > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 25 && player.dimensionBoosts <= 1 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "AD multiplier from Tickspeed purchases",
    effect: () => 1 + Tickspeed.totalUpgrades / 15,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Vector 2",
    id: 2,
    requirement: () => `Have ${format(1e35)} antimatter with upto two Dimension Boosts, no galaxies (pre-Infinity)`,
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
    requirement: () => `Have ${format(1e150)} antimatter with upto four Dimension Boosts, no galaxies and only one of each dimension tier (pre-Infinity)`,
    hasFailed: () => player.dimensionBoosts > 4 || player.galaxies > 0 || PlayerProgress.infinityUnlocked() || AntimatterDimensions.all.some(ad => ad.bought > 1),
    checkRequirement: () => player.antimatter.e >= 40 && player.dimensionBoosts <= 4 && player.galaxies == 0 && !PlayerProgress.infinityUnlocked() && AntimatterDimensions.all.some(ad => ad.bought < 2),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "First AD multiplier by eaghth AD",
    effect: () => Decimal.pow(1.1, AntimatterDimension(8).bought).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Galatic Inforcement",
    id: 4,
    requirement: () => `Have ${format(1e7)} antimatter with no Dimension Boosts, one galaxy, up to ten 2nd dimentsions (pre-Infinity)`,
    hasFailed: () => player.dimensions.antimatter[1].amount.gt(10) || player.galaxies > 1 || player.dimensionBoosts > 0 || PlayerProgress.infinityUnlocked(),
    checkRequirement: () => player.antimatter.e >= 7 && !player.dimensions.antimatter[1].amount.gt(20) && player.galaxies <= 1 && !player.dimensionBoosts > 0 && !PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "additonal Tickspeed purchases by their amount",
    effect: () => Math.floor(Math.log2(player.totalTickBought + Tickspeed.continuumValue + 1) ** 2),
    formatEffect: value => "+" + formatInt(value)
  },
  {
    name: "Galatic Limitaion",
    id: 5,
    requirement: () => `Have ${format(1e25)} antimatter with no Dimension Boosts, one galaxy, up to 20 4th dimentsions (pre-Infinity)`,
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
    requirement: () => `reach ${format(1.79e308)} antimatter with only one antimatter galaxy (pre-Infinity)`,
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
    requirement: () => `have ${format(3)} antimatter galaxies without infinity broken (post-infinity)`,
    hasFailed: () => PlayerProgress.hasBroken(),
    checkRequirement: () => player.galaxies >= 3 && !PlayerProgress.hasBroken(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "double infinity point gain",
    effect: () => 2,
    formatEffect: value => formatX(value, 2, 2)
  },
  
];
