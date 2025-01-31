
export const preInfinityUG = [
  {
    name: "Dimless",
    id: 0,
    requirement: () => `Reach ${format(1e15)} Antimatter without any Dimension Boosts, no galaxies (pre-Infinity)`,
    hasFailed: () => false,
    checkRequirement: () => player.antimatter.gte(1e15),
    progLock: () => player.dimensionBoosts.neq(0) || player.galaxies.gt(0) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "AD multiplier from Dimension Boosts",
    effect: () => player.dimensionBoosts.div(4).add(1),
    formatEffect: value => formatX(value, 2, 2),
  },
  {
  name: "Dimensional Limits",
    id: 1,
    requirement: () => `Have ${format(1e25)} Antimatter with only one Dimension Boost, no Galaxies (pre-Infinity)`,
    hasFailed: () => false,
    checkRequirement: () => player.antimatter.gte(1e25),
    progLock: () => player.dimensionBoosts.gt(1) || player.galaxies.gt(0) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "AD multiplier from Tickspeed purchases",
    effect: () => Tickspeed.totalForEffect.div(15).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Vector 2",
    id: 2,
    requirement: () => `Have ${format(1e35)} Antimatter with upto two Dimension Boosts, no galaxies (pre-Infinity)`,
    hasFailed: () => false,
    checkRequirement: () => player.antimatter.gte(1e35),
    progLock: () => player.dimensionBoosts.gt(2) || player.galaxies.gt(0) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "25x AD multiplier oscillating over 10 seconds",
    effect: () => player.records.realTimePlayed.div(10000).sin().abs().mul(25).max(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "8th Dimensional",
    id: 3,
    requirement: () => `Have ${format(1e50)} Antimatter with upto four Dimension Boosts, no Galaxies and only one of each Dimension tier brought (pre-Infinity)`,
    hasFailed: () => AntimatterDimensions.all.some(ad => ad.bought.gt(1)),
    checkRequirement: () => player.antimatter.gte(1e50) && AntimatterDimensions.all.some(ad => ad.bought.lt(2)),
    progLock: () => player.dimensionBoosts.gt(4) || player.galaxies.gt(0) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "1st ADs multiplier by the amount of 8th ADs",
    effect: () => Decimal.pow(1.1, AntimatterDimension(8).totalAmount.div(10)).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Galactic Inforcement",
    id: 4,
    requirement: () => `Have ${format(1e7)} Antimatter with no Dimension Boosts, one Galaxy, up to ten 2nd Dimensions (pre-Infinity)`,
    hasFailed: () => AntimatterDimension(2).amount.gt(10),
    checkRequirement: () => player.antimatter.gte(1e7) && AntimatterDimension(2).amount.lte(10),
    progLock: () => player.dimensionBoosts.gt(0) || player.galaxies.gt(1) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Additional Tickspeed purchases based on their amount",
    effect: () => Tickspeed.totalForEffect.add(2).log2().pow(2).floor().sub(1),
    formatEffect: value => "+" + formatInt(value)
  },
  {
    name: "Galactic Limitation",
    id: 5,
    requirement: () => `Have ${format(1e25)} Antimatter with no Dimension Boosts, one Galaxy, up to 20 4th Dimensions (pre-Infinity)`,
    hasFailed: () => AntimatterDimension(4).amount.gt(20),
    checkRequirement: () => player.antimatter.gte(1e25) && AntimatterDimension(4).amount.lte(20),
    progLock: () => player.galaxies.gt(1) || player.dimensionBoosts.gt(0) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Additional Tickspeed purchases based on Dimension Boosts and Galaxies",
    effect: () => player.dimensionBoosts.mul(player.galaxies).add(1).log2().pow(1.75).floor(),
    formatEffect: value => "+" + formatInt(value)
  },
  {
    name: "Galactic Capacity",
    id: 6,
    requirement: () => `Reach ${format(Number.MAX_VALUE, 2)} Antimatter with only one Antimatter Galaxy (pre-Infinity)`,
    hasFailed: () => false,
    checkRequirement: () => player.antimatter.gte(Number.MAX_VALUE),
    progLock: () => player.galaxies.gt(1) || PlayerProgress.infinityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Double infinity point gain",
    effect: () => 2,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Galactic Instance",
    id: 7,
    requirement: () => `Have ${format(3)} Antimatter Galaxies without Infinity broken (pre-Break)`,
    hasFailed: () => false,
    checkRequirement: () => player.galaxies.gte(3),
    progLock: () => PlayerProgress.hasBroken(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Triple infinity point gain",
    effect: () => 3,
    formatEffect: value => formatX(value, 2, 2)
  },
  
];
