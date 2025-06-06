const celBackground = cel => [[cel, 0]];

export const enslavedQuotes = {
  initial: {
    id: 0,
    lines: [
      "A visitor? We have not had one... eons.",
      "We... had a name. It has been lost... to this place.",
      "The others... will not let us rest. We do their work with time...",
      "Place time... into places... that need it...",
      "Watch ourselves grow... pass and die.",
      "Perhaps you... will break these chains... we will wait.",
    ]
  },
  unlockRun: {
    id: 1,
    lines: [
      "The others... used us. They will use... or destroy you.",
      "End our suffering... power will be yours...",
    ]
  },
  startRun: {
    id: 2,
    lines: [
      "So little space... but no... prison... is perfect.",
      "They squeezed... this Reality... too tightly. Cracks appeared.",
      "Search... everywhere. We will help... where we can.",
      {text: "You seem lost.", displayed: () => {return Parallax.parallaxes.gte(3) }, name: 'Null', background: celBackground('null'), glitched: true}
    ]
  },
  hintUnlock: {
    id: 3,
    lines: [
      "... you need... to look harder...",
      "We think... we can help...",
      { text: "You have unlocked help from The Nameless Ones.", showCelestialName: false },
    ]
  },
  ec6C10: {
    id: 4,
    lines: [
      "... did not... underestimate you..."
    ]
  },
  completeReality: {
    id: 5,
    lines: [
      {text: "Huh there's one here too?", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      {text: "Is there one in each Reality?", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      "All... fragments... clones... freed.",
      "We have given... tools... of our imprisoning. Use them...",
      "Freedom from torture... is torture itself.",
    ]
  },
};
