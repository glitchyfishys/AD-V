const Matter = ["Antimatter", "Pseudomatter", "Nullmatter", "Realmatter"];

const celBackground = cel => [[cel, 0]];
const primaryBackground = cel => [["cante", 1.5],[cel, 1.5]];

export const canteQuotes = {
  show: {
    id: 0,
    lines: [
      "Oh it's you",
      "Your almost there",
      "Seeking my help are you?",
      "Giggle, you better be ready",
      {text: "Null what are you doing?", name: "Glitch", background: celBackground('glitch')},
      "Huh, Confusion what do you mean",
      {text: "And why are you saying actions too?", name: "Glitch", background: celBackground('glitch')},
      "Oh that? Zegary is making a Celestial... it has some issuses",
      {text: "Intriguing... what is it's name?", name: "Glitch", background: celBackground('glitch')},
      "It does not have a name yet but the project is call uncynify. Laugh, I'm still missing some info on that",
      {text: "WHY DID YOU SAY \"LAUGH\" AND NOT JUST LAUGH", name: "Glitch", background: celBackground('glitch')},
      "You know you can't stop me. Smile",
      {text: "Destroyer Just... get to it", name: "Glitch", background: celBackground('glitch')},
    ],
  },
  reforge: {
    id: 1,
    lines: [
      {text: 'Stop Destroying Realites, we need them.', displayed: () => CanteUpgrades.all[19].isUnlocked, glitched: true},
      "I see what Glitch was talking about.",
      "You ability to create... i should not explain that... for lore purposes.",
      "I'll go get Glitch in a bit, for now just continue.",
    ],
  },
  purge: {
    id: 2,
    lines: [
      "So they have finished... what happened?",
      {text: "Did they just make a new type of $1?", 1: Matter, name: "Glitch", background: celBackground('glitch')},
      "That's... new... Is this safe for a non-celestial being this powerful?",
      "They could destory everything maybe even Null!",
      {text: "Is it time for them to know..?", name: "Glitch", background: celBackground('glitch')},
      "It would be dangerous right now, HE could be watching.",
    ],
  },
  thePast: {
    id: 3,
    lines: [
      "NO NO NO, YOU SHOULD NOT REVEAL THE PAST",
      "IT'S FAR TOO DANGEROUS FOR YOU TOO KNOW",
      {text: "I think it's safe", name: "Glitch", background: celBackground('glitch')},
      {text: "They either know or will find out", name: "Glitch", background: celBackground('glitch')},
      {text: "Just let them do it", name: "Glitch", background: celBackground('glitch')},
      "... Ok?",
      {text: "... Don't be fooled, I'm stronger than you think", glitched: true}
    ],
  },
};
