const celBackground = cel => [[cel, 0]];

export const teresaQuotes = {
  initial: {
    id: 0,
    lines: [
      "We have been observing you.",
      "You have shown promise with your bending of Reality.",
      "We are the Celestials, and we want you to join us.",
      "My name is Teresa, the Celestial Of Reality.",
      {text: "You are horrible.", displayed: () => {return Null.isCorrupt }, name: 'Null', background: celBackground('null'), glitched: true},
      "Prove your worth.",
    ]
  },
  unlockReality: {
    id: 1,
    lines: [
      "I will let you inside my Reality, mortal. Do not get crushed by it."
    ]
  },
  completeReality: {
    id: 2,
    lines: [
      "Why are you still here... you were supposed to fail."
    ]
  },
  effarig: {
    id: 3,
    lines: [
      "You are still no match for us.",
      {text: "Nothing is here?", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      {text: "Were they not strong enough", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      "I hope the others succeed where I have failed."
    ]
  }
};
