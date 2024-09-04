import { DC } from "../../constants";

export const alchemyResources = {
  // T1 resources (Non-Effarig "base" resources)
  "power": {
    id: ALCHEMY_RESOURCE.POWER,
    name: "Power",
    symbol: "Ω",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 1,
    unlockedAt: 2,
    description: "provides a power to Antimatter Dimensions",
    formatEffect: value => `Antimatter Dimension multipliers ${formatPow(value, 4, 4)}`
  },
  "infinity": {
    id: ALCHEMY_RESOURCE.INFINITY,
    name: "Infinity",
    symbol: "∞",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 2,
    unlockedAt: 3,
    description: "provides a power to Infinity Dimensions",
    formatEffect: value => `Infinity Dimension multipliers ${formatPow(value, 4, 4)}`
  },
  "time": {
    id: ALCHEMY_RESOURCE.TIME,
    name: "Time",
    symbol: "Δ",
    isBaseResource: true,
    effect: amount => 1 + amount / 200000,
    tier: 1,
    uiOrder: 3,
    unlockedAt: 4,
    description: "provides a power to Time Dimensions",
    formatEffect: value => `Time Dimension multipliers ${formatPow(value, 4, 4)}`
  },
  "replication": {
    id: ALCHEMY_RESOURCE.REPLICATION,
    name: "Replication",
    symbol: "Ξ",
    isBaseResource: true,
    effect: amount => Decimal.pow10(amount / 1000),
    tier: 1,
    uiOrder: 4,
    unlockedAt: 5,
    description: `increases Replication speed`,
    formatEffect: value => `Replication speed is increased by ${formatX(value, 2, 2)}`
  },
  "dilation": {
    id: ALCHEMY_RESOURCE.DILATION,
    name: "Dilation",
    symbol: "Ψ",
    isBaseResource: true,
    effect: amount => Decimal.pow10(amount / 2000),
    tier: 1,
    uiOrder: 5,
    unlockedAt: 6,
    description: "increases Dilated Time production",
    formatEffect: value => `Dilated Time production is increased by ${formatX(value, 2, 2)}`
  },

  // T2 resources (combinations of pairs of T1 resources)
  "cardinality": {
    id: ALCHEMY_RESOURCE.CARDINALITY,
    name: "Cardinality",
    symbol: "α",
    isBaseResource: false,
    effect: amount => 1 + 0.2 / (1 + amount / 20000),
    tier: 2,
    uiOrder: 3,
    unlockedAt: 8,
    description: "reduces Replicanti slowdown when above the cap",
    formatEffect: value => `Replicanti interval increases slower ${formatX(1.2, 1, 1)} ➜
      ${formatX(value, 4, 4)} per ${format(Number.MAX_VALUE, 2)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 4
      },
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 3
      }
    ]
  },
  "eternity": {
    id: ALCHEMY_RESOURCE.ETERNITY,
    name: "Eternity",
    symbol: "τ",
    isBaseResource: false,
    effect: amount => 1 + amount / 15000,
    tier: 2,
    uiOrder: 2,
    unlockedAt: 9,
    description: "provides a power to Eternity generation",
    formatEffect: value => `Eternity generation ${formatPow(value, 4, 4)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 5
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 2
      }
    ]
  },
  "dimensionality": {
    id: ALCHEMY_RESOURCE.DIMENSIONALITY,
    name: "Dimensionality",
    symbol: "ρ",
    isBaseResource: false,
    effect: amount => Decimal.pow10(5 * amount),
    tier: 2,
    uiOrder: 1,
    unlockedAt: 10,
    description: "provides a large multiplier to all Dimensions",
    formatEffect: value => `All Dimensions ${formatX(value)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 5
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 2
      }
    ]
  },
  "inflation": {
    id: ALCHEMY_RESOURCE.INFLATION,
    name: "Inflation",
    symbol: "λ",
    isBaseResource: false,
    effect: amount => Decimal.pow10(6e9 - 3e5 * amount),
    tier: 2,
    uiOrder: 5,
    unlockedAt: 11,
    description: "provides an additional power for very large multipliers",
    formatEffect: value => `All Antimatter Dimension multipliers are ${formatPow(1.05, 2, 2)}
      if they are above ${format(value)} `,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 4
      },
      {
        resource: ALCHEMY_RESOURCE.DILATION,
        amount: 3
      }
    ]
  },
  "alternation": {
    id: ALCHEMY_RESOURCE.ALTERNATION,
    name: "Alternation",
    symbol: "ω",
    isBaseResource: false,
    effect: amount => amount / 200000,
    tier: 2,
    uiOrder: 4,
    unlockedAt: 12,
    description: "increases the strength of Tachyon Galaxies based on Replicanti",
    formatEffect: value => `Tachyon Galaxies are ${formatPercents(value, 2, 2)} stronger
      per ${format(DC.E1E6)} Replicanti`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 2
      },
      {
        resource: ALCHEMY_RESOURCE.DILATION,
        amount: 5
      }
    ]
  },

  // T3 resources (Effarig and conbinations of T1/T2 with Effarig)
  "effarig": {
    id: ALCHEMY_RESOURCE.EFFARIG,
    name: "Effarig",
    symbol: "Ϙ",
    isBaseResource: true,
    effect: amount => Math.pow(10, amount / 2500),
    tier: 1,
    uiOrder: 1.5,
    unlockedAt: 7,
    description: "increases Relic Shard gain",
    formatEffect: value => `Relic Shard gain is multiplied ${formatX(value, 2, 2)}`
  },
  "synergism": {
    id: ALCHEMY_RESOURCE.SYNERGISM,
    name: "Synergism",
    symbol: "π",
    isBaseResource: false,
    effect: amount => {
      const rawValue = 0.3 + 1.3 * Math.sqrt(amount / 25000);
      return Achievement(175).isUnlocked ? rawValue : Math.min(rawValue, 1);
    },
    tier: 3,
    uiOrder: 2,
    unlockedAt: 13,
    description: "increases the yield of Alchemy Reactions",
    formatEffect(value) {
      return `Alchemy Reaction efficiency ${formatPercents(0.3)} ➜ ${formatPercents(value, 2, 2)}
        ${(!Achievement(175).isUnlocked && value >= 1) ? " (Capped)" : ""}`;
    },
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 2
      },
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 8
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 7
      }
    ]
  },
  "momentum": {
    id: ALCHEMY_RESOURCE.MOMENTUM,
    name: "Momentum",
    symbol: "μ",
    isBaseResource: false,
    effect: amount => 1 + amount / 125000,
    tier: 3,
    uiOrder: 3,
    unlockedAt: 15,
    description: "provides a power to all Dimensions that permanently grows over time",
    formatEffect: value => `All Dimensions ${formatPow(Ra.momentumValue, 4, 4)}, increasing by
      ${format(0.005 * Achievement(175).effectOrDefault(1), 3, 3)}
      per real-time hour after the resource is unlocked, up to a maximum of ${formatPow(value, 4, 4)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 5
      },
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 2
      },
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 10
      }
    ]
  },
  "decoherence": {
    id: ALCHEMY_RESOURCE.DECOHERENCE,
    name: "Decoherence",
    symbol: "ξ",
    isBaseResource: false,
    effect: amount => 0.15 * Math.sqrt(amount / 25000),
    tier: 3,
    uiOrder: 4,
    unlockedAt: 14,
    description: "gives all basic Alchemy Resources upon refinement",
    formatEffect: value => `Refined Glyphs also give ${formatPercents(value, 2)} of their value ` +
      "to all other base resources",
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 6
      },
      {
        resource: ALCHEMY_RESOURCE.ALTERNATION,
        amount: 4
      }
    ]
  },

  // T4 resources (resources which feed directly into the final resource)
  "exponential": {
    id: ALCHEMY_RESOURCE.EXPONENTIAL,
    name: "Exponential",
    symbol: "Γ",
    isBaseResource: false,
    effect: amount => 10 * Math.pow(amount / 10000, 2),
    tier: 4,
    uiOrder: 2,
    unlockedAt: 18,
    description: "multiplies Infinity Points based on Replicanti",
    formatEffect: value => `Infinity Points multiplied by Replicanti${formatPow(value, 2, 3)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.INFLATION,
        amount: 9
      },
      {
        resource: ALCHEMY_RESOURCE.SYNERGISM,
        amount: 2
      }
    ]
  },
  "force": {
    id: ALCHEMY_RESOURCE.FORCE,
    name: "Force",
    symbol: "Φ",
    isBaseResource: false,
    effect: amount => 5 * amount,
    tier: 4,
    uiOrder: 2,
    unlockedAt: 17,
    description: "multiplies Antimatter Dimensions based on Reality Machines",
    formatEffect: value => `Multiply Antimatter Dimensions by Reality Machines${formatPow(value, 2, 2)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.DIMENSIONALITY,
        amount: 4
      },
      {
        resource: ALCHEMY_RESOURCE.MOMENTUM,
        amount: 4
      }
    ]
  },
  "uncountability": {
    id: ALCHEMY_RESOURCE.UNCOUNTABILITY,
    name: "Uncountability",
    symbol: "Θ",
    isBaseResource: false,
    effect: amount => 160 * Math.sqrt(amount / 25000) * GlitchRealityUpgrades.all[2].effectOrDefault(1),
    tier: 4,
    uiOrder: 3,
    unlockedAt: 19,
    description: "passively generates Realities and Perk Points",
    formatEffect: value => `Generate ${format(value, 2, 2)} Realities and Perk Points per second`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 10
      },
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 3
      },
      {
        resource: ALCHEMY_RESOURCE.CARDINALITY,
        amount: 8
      }
    ]
  },
  "boundless": {
    id: ALCHEMY_RESOURCE.BOUNDLESS,
    name: "Boundless",
    symbol: "Π",
    isBaseResource: false,
    effect: amount => amount / 80000,
    tier: 4,
    uiOrder: 1,
    unlockedAt: 20,
    description: "makes Tesseracts stronger",
    formatEffect: value => `Tesseracts are +${formatPercents(value, 2, 2)} stronger`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.ETERNITY,
        amount: 6
      },
      {
        resource: ALCHEMY_RESOURCE.INFLATION,
        amount: 9
      }
    ]
  },
  "multiversal": {
    id: ALCHEMY_RESOURCE.MULTIVERSAL,
    name: "Multiversal",
    symbol: "Σ",
    isBaseResource: false,
    effect: amount => Math.min(32 * Math.pow(amount / 25000, 2), 50),
    tier: 4,
    uiOrder: 5,
    unlockedAt: 16,
    description: "makes each Reality simulate more Realities",
    formatEffect: value => `Each Reality simulates ${format(value, 2, 3)} additional Realities, giving all
      the same rewards as if it was amplified`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.ALTERNATION,
        amount: 8
      },
      {
        resource: ALCHEMY_RESOURCE.DECOHERENCE,
        amount: 2
      }
    ]
  },
  "unpredictability": {
    id: ALCHEMY_RESOURCE.UNPREDICTABILITY,
    name: "Unpredictability",
    symbol: "Λ",
    isBaseResource: false,
    // Somewhat ugly number to make this show 70.00% at cap
    effect: amount => amount / (10714.28 + amount),
    tier: 4,
    uiOrder: 4,
    unlockedAt: 21,
    description: "makes each Alchemy Reaction have a chance to happen twice",
    formatEffect: value => `Any Alchemy Reaction has a ${formatPercents(value, 2, 2)}
      chance of triggering again`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 7
      },
      {
        resource: ALCHEMY_RESOURCE.DECOHERENCE,
        amount: 2
      },
      {
        resource: ALCHEMY_RESOURCE.SYNERGISM,
        amount: 5
      }
    ]
  },

  // T5 (Reality)
  "reality": {
    id: ALCHEMY_RESOURCE.REALITY,
    name: "Reality",
    symbol: "Ϟ",
    isBaseResource: false,
    effect: amount => Math.floor(amount),
    tier: 5,
    uiOrder: 1,
    unlockedAt: 25,
    description: "can be consumed to create Reality Glyphs",
    formatEffect: value => `Consume all Reality Resource to create a level ${formatInt(value)} Reality Glyph`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.EXPONENTIAL,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.FORCE,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.UNCOUNTABILITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.BOUNDLESS,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.MULTIVERSAL,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.UNPREDICTABILITY,
        amount: 1
      }
    ]
  },
  
  "shifter": {
    id: ALCHEMY_RESOURCE.SHIFTER,
    name: "Sifter",
    symbol: "∬",
    isBaseResource: false,
    effect: amount => Math.floor(amount * 0.8),
    tier: 5,
    uiOrder: 2,
    unlockedAt: 30,
    description: "boost all basic alchemy resources amounts to a mininum amount",
    formatEffect: value => `boost all basic resources to a mininum of ${formatInt(value)} `,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.CARDINALITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.ETERNITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.DIMENSIONALITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.INFLATION,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.ALTERNATION,
        amount: 1
      }
    ]
  },
  
  "alter": {
    id: ALCHEMY_RESOURCE.ALTER,
    name: "Alter",
    symbol: "∴",
    isBaseResource: false,
    effect: amount => Math.max(1,Math.floor(amount)),
    tier: 5,
    uiOrder: 3,
    unlockedAt: 35,
    description: "gain more singularities",
    formatEffect: value => `${formatX(value)} Dark Energy gain`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.DECOHERENCE,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.MOMENTUM,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.SYNERGISM,
        amount: 1
      }
    ]
  },

  // glitched T6
  "glitch": {
    id: ALCHEMY_RESOURCE.GLITCH,
    name: "Glitch",
    symbol: "Ĝ",
    isBaseResource: false,
    effect: amount => Math.floor(amount),
    tier: 6,
    uiOrder: 1,
    unlockedAt: 45,
    description: "unkown",
    formatEffect: value => `unkown ${formatInt(value)} GLITCHED Glyph`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE.POWER,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.EFFARIG,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.TIME,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.INFINITY,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.REPLICATION,
        amount: 1
      },
      {
        resource: ALCHEMY_RESOURCE.DILATION,
        amount: 1
      }
    ]
  },
};
