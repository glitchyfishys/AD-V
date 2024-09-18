// entropy
export const GlitchRifts = {
  alpha: {
    id: 1,
    key: "alpha",
    name: "pre-break/infinity",
    drainResource: "IP",
    unlock: () => true,
    percentage: totalFill => { let a = 0; preInfinityUGs.all.forEach(x => x.isBought ? a++ : false); return a; },
    percentageToFill: 8,
    milestones: [
      {
        resource: "alpha",
        requirement: 0.25,
        description: "First Antimatter Dimension gains x7 multiplier",
        effect: () => 7,
        format: effect => `${formatX(effect)} first AD`,
        base: 1,
      },
      {
        resource: "alpha",
        requirement: 0.5,
        description: "Eighth AD gains x30 multiplier",
        effect: () => 30,
        format: effect => `${formatX(effect)} Eighth Antimatter Dimension`,
        base: 1,
      },
      {
        resource: "alpha",
        requirement: 0.75,
        description: "Small Game speed multiplier",
        effect: () => 1.5,
        format: effect => `${formatX(effect,2,1)} Game speed`,
        base: 1,
      },
      {
        resource: "alpha",
        requirement: 1,
        description: "Very small Dimension Boost multiplier based on IP multiplier purchases (caped at 5)",
        effect: () => Math.clamp(player.IPMultPurchases ** 0.11, 1, 5),
        format: effect => `${formatX(effect,2,2)} dimboost`,
        base: 1,
      },
    ],
  },
  beta: {
    id: 2,
    key: "beta",
    name: "post-break-infinity",
    drainResource: "IP",
    unlock: () => PlayerProgress.infinityUnlocked(),
    percentage: totalFill => {
      let a = 0;
      breakInfinityUGs.all.forEach(x => x.isBought ? a++ : false);
      return a
    },
    percentageToFill: 6,
    milestones: [
      {
        resource: "beta",
        requirement: 0.33,
        description: "+0.02 to Infinity power conversion rate",
        effect: () => 0.02,
        format: effect => `+${format(effect,2,2)} Infinity power conversion rate`,
        base: 0,
      },
      {
        resource: "beta",
        requirement: 0.833,
        description: "+0.03 to Infinity power conversion rate",
        effect: () => 0.03,
        format: effect => `+${format(effect,2,2)} Infinity power conversion rate`,
        base: 0,
      },
      {
        resource: "beta",
        requirement: 1,
        description: "-0.05 to Free Tickspeed threshold",
        effect: () => 0.05,
        format: effect => `-${format(effect,2,2)} Free Tickspeed threshold`,
        base: 0,
      },
    ],
  },
  delta: {
    id: 3,
    key: "delta",
    name: "eternity",
    unlock: () => PlayerProgress.eternityUnlocked() || Currency.infinityPoints.gte(1e250),
    percentage: totalFill => {
      let a = 0;
      eternityUGs.all.forEach(x => x.isBought ? a++ : false);
      return a
    },
    percentageToFill: 6,
    milestones: [
      {
        resource: "delta",
        requirement: 0.33,
        description: "Replicanti is 1% faster per Antimatter Galaxy past 125 upto 5x",
        effect: () => Math.clamp(1.01 ** (player.galaxies - 125), 1, 5),
        format: effect => `${formatX(effect,2,2)} Replicanti speed`,
        base: 1,
      },
      {
        resource: "delta",
        requirement: 0.66,
        description: "25 Free Tickspeed per Time Study brought after 10",
        effect: () => Math.max(25 * (player.timestudy.studies.length - 10), 0),
        format: effect => `+${format(effect,2)} Free Tickspeed`,
        base: 0,
      },
      {
        resource: "delta",
        requirement: 1,
        description: "Dilation is slightly weaker by 0.01",
        effect: () => 0.01,
        format: effect => `+${format(effect,2,2)} to Dilation nerf`,
        base: 0,
      },
    ],
  },
  gamma: {
    id: 4,
    key: "gamma",
    name: "reality",
    unlock: () => PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought,
    percentage: totalFill => {
      let a = 0;
      realityUGs.all.forEach(x => x.isBought ? a++ : false);
      return a
    },
    percentageToFill: 14,
    milestones: [
      {
        resource: "gamma",
        requirement: 0.15,
        description: "TDs gain a 1.01 power",
        effect: () => 1.01,
        format: effect => `TD ${formatPow(effect,2,2)}`,
        base: 1,
      },
      {
        resource: "gamma",
        requirement: 0.3,
        description: "10 times Perk Point gain",
        effect: () => 10,
        format: effect => `${formatX(effect)} Perk Points`,
        base: 1,
      },
      {
        resource: "gamma",
        requirement: 0.5,
        description: "+10% glyph rarity",
        effect: () => 10,
        format: effect => `+${formatRarity(effect)} Glyph Rarity`,
        base: 0,
      },
      {
        resource: "gamma",
        requirement: 0.75,
        description: "DMDs gain a 1.05 power",
        effect: () => 1.05,
        format: effect => `DMD ${formatPow(effect,2,2)}`,
        base: 1,
      },
      {
        resource: "gamma",
        requirement: 0.9,
        description: "an additional 50 higher cap for Ra memory levels",
        effect: () => 50,
        format: effect => `+${format(effect)} Ra memory level cap`,
        base: 0,
      },
      {
        resource: "gamma",
        requirement: 1,
        description: "Unlock Glitch the celestial of Programing, having unique Goals and Upgrades",
        effect: () => 1,
        format: effect => effect == 0 ? "Locked" : "Unlocked, Glitch",
        base: 0,
      },
    ],
  },
};
