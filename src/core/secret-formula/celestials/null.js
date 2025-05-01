import wordShift from "@/core/word-shift";

const codes = [
    'facfa885bacd1a8d905e818450bffb2fb0ce9087bf22c88aeedb19c3adb9c1d1',
    '2c6d439011a7a109d36da2e6f73572e5e05d5dfb3bbecb6ae432a174630f215d',
    'a7ba9ce5b2f8bc7972b9f27679a137337107ced7c4e25e4988ec941a450a1a28',
    '97dbf421476779d05b6fa04cb1633296ae1db94b8c8bf2bf0d526dbe97c04af3',
    'cc265177864030e58b8c9a12b2a01fa487d8dd4f72de02f532a02b9a42844308',
    'ae3d0987d8f3feafc67c09fe32b50a6d60fd65e8d6a971c39d3aa9533ae1c549',
    '036a175b372c2f368d22f8861d5417b5ccdf69548a088e8c997629ed79f06e11'
]

export const NullData = {
    get passcode() {
        if(Null.isCorrupt) return codes[6];
        return codes[Parallax.parallaxes.min(5).toNumber()]
    },
    upgrades: [
      {
        id: 1,
        description: () => `Multiply Cycles by ${format(10)} for each Cycle unlocked`,
        cost: new Decimal(100),
        effect: () => (10 ** NullCycles.highestUnlocked),
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 2,
        description: () => 'Cycles gain a power for each Cycle unlocked',
        cost: new Decimal(1e6),
        effect: () => 1 + (NullCycles.highestUnlocked / 25),
        formatEffect: e => `${formatPow(e,2,2)}`,
      },
      {
        id: 3,
        description: () => 'The first Cycle is stronger based on the last one',
        cost: new Decimal(1e13),
        effect: () => NullCycle(NullCycles.highestUnlocked).amount.add(1).pow(0.2).div(250).max(1),
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 4,
        description: () => `Multiply every second Cycle by ${format(5)} for each Cycle unlocked`,
        cost: new Decimal(1e17),
        effect: () => (5 ** NullCycles.highestUnlocked),
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 5,
        description: () => `Reduse the Cycle to Abyssal Matter nerf`,
        cost: new Decimal(1e30),
        effect: () => 1.3333,
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 6,
        description: () => `The first Cycle boosts all Cycles`,
        cost: new Decimal(1e40),
        effect: () => NullCycle(1).amount.add(10).log10().pow(1.35),
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 7,
        description: () => `Abyssal Matter slightly boosts Cycles`,
        cost: new Decimal(1e50),
        effect: () =>Currency.abyssalMatter.value.pow(0.065).max(1),
        formatEffect: e => `${formatX(e,2,2)}`,
      },
      {
        id: 8,
        description: () => `Parallaxes also give a power to Cycles and reduse cost scaling`,
        cost: new Decimal(1e60),
        effect: () => true
      },
      {
        id: 9,
        description: () => `Cycles boost them selves`,
        cost: new Decimal(1e85),
        effect: () => true
      },
      {
        id: 10,
        description: () => `Cycles per purchase it better`,
        cost: new Decimal(1e100),
        effect: () => 3,
        formatEffect: e => `${formatX(e,2,2)}`,
        onPurchased: () => {Null.quotes.enrage.show()}
      },
      {
        id: 11,
        description: () => `Parallax base multiplier is boosted to ${formatX(4)}`,
        cost: new Decimal(1e140),
        effect: () => false,
      },
      {
        id: 12,
        description: () => `The last Cycle is stronger`,
        cost: new Decimal(1e185),
        effect: () => false
      },
      {
        id: 13,
        description: () => `Corrupt Matter boosts Cycles`,
        cost: new Decimal(5),
        effect: () => Currency.corruptMatter.value.pow(0.75).max(1),
        formatEffect: e => `${formatX(e,2,2)}`,
        corrupt: true,
      },
      {
        id: 14,
        description: () => `Corrupt Matter gives a power to Cycles`,
        cost: new Decimal(50),
        effect: () => {
            let v = Currency.corruptMatter.value.pow(0.2).div(10).add(1);
            if(v.gt(15)) v = v.div(v.div(15).pow(0.45));
            if(v.gt(50)) v = v.div(v.div(50).pow(0.55));
            return v.clamp(1, NullUpgrades.all[18].isUnlocked ? 1e5 : 15);
        },
        formatEffect: e => `${formatPow(e,2,2)}`,
        corrupt: true,
      },
      {
        id: 15,
        description: () => `Cycle decay is ${formatPercents(0.2)} weaker`,
        cost: new Decimal(100),
        effect: () => 0.8,
        corrupt: true,
      },
      {
        id: 16,
        description: () => `Unlock Cycle Autobuyers and buy max Paralaxes`,
        cost: new Decimal(1000),
        effect: () => false,
        corrupt: true,
      },
      {
        id: 17,
        description: () => `Unlock a non-corrupt Null Upgrade Autobuyer`,
        cost: new Decimal(1e5),
        effect: () => false,
        corrupt: true,
      },
      {
        id: 18,
        description: () => `Reduse Cycle softcaps`,
        cost: new Decimal(1e9),
        effect: () => false,
        corrupt: true,
      },
      {
        id: 19,
        description: () => `Upgrade 14 and Corrupt Matter gain are better`,
        cost: new Decimal(1e11),
        effect: () => false,
        corrupt: true,
      },
      {
        id: 20,
        description: () => `Break a chain that binds you to this Realm`,
        cost: new Decimal(1e30),
        effect: () => false,
        corrupt: true,
        onPurchased: () => {Null.quotes.end.show()}
      },
    ],
};
