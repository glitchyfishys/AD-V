export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Teresa",
      color: "var(--color-ra-pet--teresa)",
      chunkGain: "Eternity Points",
      memoryGain: "current RM",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.eternityPoints.value.pLog10() / 1e4, 3),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(1)
    },
    effarig: {
      id: "effarig",
      name: "Effarig",
      color: "var(--color-ra-pet--effarig)",
      chunkGain: "Relic Shards gained",
      memoryGain: "best Glyph level",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => 4 * Decimal.pow(Effarig.shardsGained, 0.15).toNumber(),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(1)
    },
    enslaved: {
      id: "enslaved",
      name: "The Nameless Ones",
      color: "var(--color-ra-pet--enslaved)",
      chunkGain: "Time Shards",
      memoryGain: "total time played",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.timeShards.value.pLog10() / 3e5, 2),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(1)
    },
    v: {
      id: "v",
      name: "V",
      color: "var(--color-ra-pet--v)",
      chunkGain: "Infinity Power",
      memoryGain: "total Memory levels",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.infinityPower.value.pLog10() / 1e7, 1.5),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(1)
    },
    glitchyfishys: {
      id: "glitchyfishys",// i dont want to make a migration just to change this to glitch
      name: "Glitch",
      color: "var(--color-ra-pet--glitch)",
      chunkGain: "current RM",
      memoryGain: "reality machines and antimatter",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => 5 * Math.pow(Currency.realityMachines.value.pLog10() / 10, 1.8),
      memoryProductionMultiplier: () => Ra.unlocks.glitchyfishysXP.effectOrDefault(1) *
      Ra.unlocks.memroygain1.effectOrDefault(1) * Ra.unlocks.memroygain2.effectOrDefault(1) *
      Ra.unlocks.memroygain3.effectOrDefault(1) * Ra.unlocks.memroygain4.effectOrDefault(1) *
      Ra.unlocks.memroygain5.effectOrDefault(1)
    },
    cante: {
      id: "cante",
      name: "Cante",
      color: "#71c6f3",
      chunkGain: "Replicanti",
      memoryGain: "Replicanti Muliplier",
      requiredUnlock: () => MetaFabricatorUpgrade(25).isBought,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.replicanti.value.pLog10() / 5e14, 0.8),
      memoryProductionMultiplier: () => Ra.unlocks.canteXP.effectOrDefault(1)
    },
    null: {
      id: "null",
      name: "Null",
      color: "#000000",
      chunkGain: "Metas",
      memoryGain: "Null",
      requiredUnlock: () => MetaFabricatorUpgrade(25).isBought,
      rawMemoryChunksPerSecond: () => 26 * Math.pow(Currency.metas.value.pLog10() / 10, 1.5),
      memoryProductionMultiplier: () => Ra.unlocks.nullXP.effectOrDefault(1)
    },
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "Tachyon Particles are given immediately when Time Dilation is active",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: true
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: () => `Unlock Charged Infinity Upgrades. You get one more maximum
        Charged Infinity Upgrade every ${formatInt(2)} levels`,
      effect: () => Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: true
    },
    teresaXP: {
      id: 2,
      reward: "All Memory Chunks produce more Memories based on Reality Machines",
      effect: () => 1 + Math.pow(Currency.realityMachines.value.pLog10() / 100, 0.5),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "Unlock Altered Glyphs, which grant new effects to Glyphs based on Glyph Sacrifice",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: true
    },
    effarigUnlock: {
      id: 4,
      reward: "Unlock Effarig's Memories",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "Purchase caps are raised in Teresa's Perk Point Shop",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: `In non-Celestial Realities, gain Tachyon Particles as if you reached the square root of your total
        antimatter in Dilation. Any multipliers to TP gain are applied retroactively, even outside Dilation`,
      effect: () => player.records.totalAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `Get ${formatX(2)} Glyph choices and the bonus to Glyph rarity from Relic Shards
        is always its maximum value (not from ARS perk)`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: `Unlock Glyph Alchemy, which adds alchemical resources you can increase by Refining Glyphs. You unlock
        more resources through Effarig levels. Access through a new Reality tab.`,
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "All Memory Chunks produce more Memories based on highest Glyph level",
      effect: () => 1 + player.records.bestReality.glyphLevel / 6000,
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `Glyphs always have ${formatInt(4)} effects, and Effarig Glyphs can now have up to ${formatInt(7)}`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "Unlock Nameless's Memories",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "Glyph level is increased based on Relic Shards gained",
      effect: () => 100 * Math.pow(Decimal.log10(Decimal.max(Effarig.shardsGained, 1)), 2),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `Glyphs are always generated with ${formatPercents(1)} rarity and
        Glyph Sacrifice gain is raised to a power based on Relic Shards`,
      effect: () => 1 + Effarig.maxRarityBoost / 100,
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "Unlock Black Hole power upgrade autobuyers",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: true
    },
    improvedStoredTime: {
      id: 15,
      reward: "Stored game time is amplified and you can store more real time, increasing with Nameless levels",
      effects: {
        gameTimeAmplification: () => Decimal.pow(20, Math.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => 1000 * 3600 * Ra.pets.enslaved.level,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: true
    },
    enslavedXP: {
      id: 16,
      reward: "All Memory Chunks produce more Memories based on total time played",
      effect: () => 1 + Decimal.log10(player.records.totalTimePlayed) / 175,
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `Black Hole charging now only uses ${formatPercents(0.99)} of your game speed and you can
        automatically discharge ${formatPercents(0.01)} of your stored game time every ${formatInt(5)} ticks.`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: true
    },
    vUnlock: {
      id: 18,
      reward: "Unlock V's Memories",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "Gain more Dilated Time based on peak game speed in each Reality",
      effect: () => Math.max(Math.pow(Decimal.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: true
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `All basic Glyphs gain the increased game speed effect from Time Glyphs,
        and Time Glyphs gain an additional effect`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "Rebuyable Reality upgrades are bought automatically and Auto-Eternity Challenges happen instantly",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: true
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `In non-Celestial Realities, Time Dilation is unlocked automatically for free at
        ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)} Time Theorems`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "All Memory Chunks produce more Memories based on total Celestial levels.",
      effect: () => 1 + Ra.totalPetLevel / 50,
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `Unlock Hard V-Achievements and unlock a Triad Study every ${formatInt(6)} levels.
        Triad Studies are located at the bottom of the Time Studies page`,
      effect: () => Math.min(Math.floor(Ra.pets.v.level / 6), 4),
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: true
    },
    continuousTTBoost: {
      id: 25,
      reward: "Time Theorems boost all forms of continuous non-dimension production",
      effects: {
        ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
        eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
        infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
        replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
        dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
        memories: () => 1 + Ra.theoremBoostFactor() / 50,
        memoryChunks: () => 1 + Ra.theoremBoostFactor() / 50,
        autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: true
    },
    achievementTTMult: {
      id: 26,
      reward: "Achievement multiplier applies to Time Theorem generation",
      effect: () => Achievements.power,
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: true
    },
    achievementPower: {
      id: 27,
      reward: () => `Achievement multiplier is raised ${formatPow(1.5, 1, 1)}`,
      effect: 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: true
    },
    memroygain1: {
      id: 28,
      reward: () => `increase memory gain by 10 times`,
      effect: 10,
      pet: "glitchyfishys",
      level: 1,
      displayIcon: `<i class="far fa-brain"></i>`,
    },
    memroygain2: {
      id: 29,
      reward: () => `increase memory gain by 15 times`,
      effect: 15,
      pet: "glitchyfishys",
      level: 5,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    glitchyfishysXP: {
      id: 30,
      reward: () => `increase all memory gain by Reality Machines AND Antimatter`,
      effect: () => 1 + Math.pow(Currency.realityMachines.value.pLog10() / 25, 0.18) * Math.pow(Currency.antimatter.value.pLog10() / 1e5, 0.18),
      pet: "glitchyfishys",
      level: 10,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain3: {
      id: 31,
      reward: () => `increase memory gain by 5 times`,
      effect: 5,
      pet: "glitchyfishys",
      level: 15,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain4: {
      id: 32,
      reward: () => `increase memory gain by 5 times`,
      effect: 5,
      pet: "glitchyfishys",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    memroygain5: {
      id: 33,
      reward: () => `increase memory gain by 5 times`,
      effect: 5,
      pet: "glitchyfishys",
      level: 30,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    PassiveAlc: {
      id: 34,
      reward: () => `alchamy happens passively `,
      effect: 1,
      pet: "glitchyfishys",
      level: 40,
      displayIcon: `<i class="far fa-dot-circle"></i>`,
    },
    gainoutside: {
      id: 35,
      reward: () => `gain Memory Chunks outside Ra's reality.`,
      effect: 1,
      pet: "glitchyfishys",
      level: 50,
      displayIcon: `<span class="fas fa-bolt"></span>`,
    },
    canteXP: {
      id: 37,
      reward: () => `Gain more memorys based on`,
      effect: () => Decimal.pow(Ra.pets.cante.level, 4).toNumber(),
      pet: "cante",
      level: 2,
      displayIcon: `Ξ`,
    },
    repMul: {
      id: 37,
      reward: () => `Gain a multiplier to Replicanti based on Cante's memory level`,
      effect: () => Decimal.pow(Ra.pets.cante.level, 4),
      pet: "cante",
      level: 5,
      displayIcon: `Ξ`,
    },
    repEffect: {
      id: 38,
      reward: () => `Increse the effectiveness of RGs`,
      effect: () => Decimal.pow(Ra.pets.cante.level, 4),
      pet: "cante",
      level: 15,
      displayIcon: `Ξ`,
    },
    repCap: {
      id: 39,
      reward: () => `Increse the cap of RGs`,
      effect: () => Decimal.pow(Ra.pets.cante.level, 2),
      pet: "cante",
      level: 50,
      displayIcon: `Ξ`,
    },
    canteUnlock: {
      id: 40,
      reward: () => `Unlock Cante, the Celestial of Replicanti`,
      pet: "cante",
      level: 150,
      displayIcon: `Ξ`,
    },
    nullXP: {
      id: 41,
      reward: () => `NYI`,
      effect: () => Decimal.pow(Ra.pets.null.level, 2).toNumber(),
      pet: "null",
      level: 5,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullCharge: {
      id: 41,
      reward: () => `NYI`,
      pet: "null",
      level: 15,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUpgrade1: {
      id: 42,
      reward: () => `NYI`,
      pet: "null",
      level: 35,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUpgrade2: {
      id: 43,
      reward: () => `NYI`,
      pet: "null",
      level: 75,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUpgrade3: {
      id: 44,
      reward: () => `NYI`,
      pet: "null",
      level: 125,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
    nullUpgrade1: {
      id: 45,
      reward: () => `Nnlock Null, the Celestial of void`,
      pet: "null",
      level: 150,
      displayIcon: `<span class="fas fa-droplet"></span>`,
    },
  }
};
