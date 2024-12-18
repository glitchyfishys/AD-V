
export const breakInfinityUG = [
  {
    name: "Limited Space",
    id: 0,
    requirement: () => `Reach ${format("1e450")} Antimatter up to 4 Dimension Boosts, one galaxy (pre-Eternity)`,
    checkRequirement: () => player.antimatter.e >= 450,
    hasFailed: () => false,
    progLock: () => player.dimensionBoosts > 4 || player.galaxies > 1 || PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "IP multiplier from Antimatter galaxies",
    effect: () => 1 + Math.pow(player.galaxies, 1.25),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
  name: "Infinitely Limiting",
    id: 1,
    requirement: () => `Reach ${format(2000)} (pending) Infinity Points with up to four Dimension Boosts and one Antimatter galaxy (pre-Eternity)`,
    checkRequirement: () =>  gainedInfinityPoints().gt(2000),
    hasFailed: () => false,
    progLock: () => player.dimensionBoosts > 4 || player.galaxies > 1 || PlayerProgress.eternityUnlocked(),
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
    checkRequirement: () => player.infinityPoints.e >= 150,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "IP multiplier based on Antimatter Galaxies",
    effect: () => 1 + Math.pow(player.galaxies, 3),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Replicated Infinity",
    id: 4,
    requirement: () => `Have ${format(10)} Replicanti without any upgrades (pre-Eternity)`,
    hasFailed: () => player.replicanti.chance > 0.01 || player.replicanti.interval < 1000,
    checkRequirement: () => player.replicanti.amount.gte(10) && player.replicanti.chance == 0.01 && player.replicanti.interval >= 1000,
    progLock: () => PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Replicanti speed is incresace it's amount",
    effect: () => 1 + Math.sqrt(player.replicanti.amount.log10()),
    formatEffect: value => formatX(value, 2, 2),
    isUseless: () => Pelle.isDoomed
  },
  {
    name: "Cloned Replication",
    id: 5,
    requirement: () => `Have ${format(1e100, 2)} Replicanti without any upgrades (pre-Eternity)`,
    hasFailed: () => player.replicanti.chance > 0.01 || player.replicanti.interval < 1000,
    checkRequirement: () => player.replicanti.amount.gte(1e100) && player.replicanti.chance == 0.01 && player.replicanti.interval >= 1000,
    progLock: () => PlayerProgress.eternityUnlocked(),
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
    description: "Increase Replicanti speed based on their Galaxies",
    effect: () => 1 + (Math.pow(player.replicanti.galaxies, 1.2) / 38),
    formatEffect: value => formatX(value, 2, 2)
  },
  
];
