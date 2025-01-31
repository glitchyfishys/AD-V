
export const breakInfinityUG = [
  {
    name: "Limited Space",
    id: 0,
    requirement: () => `Reach ${format("1e450")} Antimatter up to 4 Dimension Boosts, one galaxy (pre-Eternity)`,
    checkRequirement: () => player.antimatter.gte('1e450'),
    hasFailed: () => false,
    progLock: () => player.dimensionBoosts.gt(4) || player.galaxies.gt(1) || PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "IP multiplier from Antimatter galaxies",
    effect: () => player.galaxies.pow(1.25).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Infinitely Limiting",
    id: 1,
    requirement: () => `Reach ${format(2000)} (pending) Infinity Points with up to four Dimension Boosts and one Antimatter galaxy (pre-Eternity)`,
    checkRequirement: () =>  gainedInfinityPoints().gt(2000),
    hasFailed: () => false,
    progLock: () => player.dimensionBoosts.gt(4) || player.galaxies.gt(1) || PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "x10 Infinity Points",
    effect: () => 10,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Chaos",
    id: 2,
    requirement:  "Finish IC1 without Infinity Dimensions",
    hasFailed: () => player.dimensions.infinity[0].amount.gt(0),
    checkRequirement: () => player.antimatter.gte("1e650") && player.challenge.infinity.current == 1 && !player.dimensions.infinity[0].amount.gt(0),
    progLock: () => false,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Get 1e50 times more Infinity Points",
    effect: () => 1e50,
    formatEffect: value => formatX(value, 2, 2),
    isUseless: () => Pelle.isDoomed
  },
  {
    name: "Cosmic Infinity",
    id: 3,
    requirement: () => `Have ${format(1e150)} Infinity Points`,
    progLock: () => false,
    checkRequirement: () => player.infinityPoints.gte(1e150),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "IP multiplier based on Antimatter Galaxies",
    effect: () => player.galaxies.pow(3).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Replicated Infinity",
    id: 4,
    requirement: () => `Have ${format(10)} Replicanti without any upgrades (pre-Eternity)`,
    hasFailed: () => player.replicanti.chance.gt(0.01) || player.replicanti.interval.lt(1000),
    checkRequirement: () => player.replicanti.amount.gte(10) && player.replicanti.chance.eq(0.01) && player.replicanti.interval.gte(1000),
    progLock: () => PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Replicanti speed is incresed it's amount",
    effect: () => player.replicanti.amount.log10().sqrt().add(1),
    formatEffect: value => formatX(value, 2, 2),
    isUseless: () => Pelle.isDoomed
  },
  {
    name: "Cloned Replication",
    id: 5,
    requirement: () => `Have ${format(1e100, 2)} Replicanti without any upgrades (pre-Eternity)`,
    hasFailed: () => player.replicanti.chance.gt(0.01) || player.replicanti.interval.lt(1000),
    checkRequirement: () => player.replicanti.amount.gte(1e100) && player.replicanti.chance.eq(0.01) && player.replicanti.interval.gte(1000),
    progLock: () => PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Increase Replicanti speed based on their Galaxies",
    effect: () => player.replicanti.galaxies.pow(1.2).div(38).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  
];
