const celBackground = cel => [[cel, 0]];
const RaMulti = ["Ra", "Rancey", "Repress"];

const flashCelestial = [
  ["ra", 0.4],
  ["laitela", 0.4],
  ["pelle", 0.4],
  ["teresa", 0.4],
  ["effarig", 0.4],
  ["enslaved", 0.4],
  ["v", 0.4]
];

export const raQuotes = {
  unlock: {
    id: 0,
    lines: [
      "A... visitor?",
      "I am here! I am the one you are looking for... I think...",
      "What even was I again?",
      "Oh right, the Celestial of Memories.",
    ]
  },
  realityEnter: {
    id: 1,
    lines: [
      "I have not seen the others in so long...",
      "Can you help me remember them?",
      "I could give you powers in exchange.",
    ]
  },
  teresaStart: {
    id: 2,
    requirement: () => Ra.pets.teresa.level >= 2,
    lines: [
      "Te... re... sa...",
      "I think I remember.",
    ]
  },
  teresaLate: {
    id: 3,
    requirement: () => Ra.pets.teresa.level >= 15,
    lines: [
      "Teresa dealt with machines, I believe.",
      "I remember visiting Teresa’s shop a few times.",
      "Wait, someone else had a shop too, right?",
    ]
  },
  effarigStart: {
    id: 4,
    requirement: () => Ra.pets.effarig.level >= 2,
    lines: [
      "Eff... a... rig",
      "I remember Effarig being friendly.",
    ]
  },
  effarigLate: {
    id: 5,
    requirement: () => Ra.pets.effarig.level >= 15,
    lines: [
      "Effarig was very particular?",
      "And I also remember a frightening Reality...",
      "It was about... suffering?",
    ]
  },
  enslavedStart: {
    id: 6,
    requirement: () => Ra.pets.enslaved.level >= 2,
    lines: [
      "I cannot remember this one completely...",
    ]
  },
  enslavedLate: {
    id: 7,
    requirement: () => Ra.pets.enslaved.level >= 15,
    lines: [
      "I am starting to remember...",
      "Why I am here...",
      "Why I am alone...",
      "Help me.",
    ]
  },
  vStart: {
    id: 8,
    requirement: () => Ra.pets.v.level >= 2,
    lines: [
      "Had I met this one?",
      "So lonely, yet willingly so...",
    ]
  },
  vLate: {
    id: 9,
    requirement: () => Ra.pets.v.level >= 15,
    lines: [
      "I think I met V once...",
      "I can remember the achievements.",
    ]
  },
  remembrance: {
    id: 10,
    requirement: () => Ra.remembrance.isUnlocked,
    lines: [
      "I remembered something!",
      "Watch this!",
      "Remembrance!",
      "I can focus even harder on remembering them now!",
    ]
  },
  midMemories: {
    id: 11,
    requirement: () => Ra.totalPetLevel >= 50,
    lines: [
      "Realities are my homes, yet I cannot make my own Reality.",
      "I can only copy the ones of my friends.",
      "But... why am I hearing voices?",
      "Are they asking for help?",
    ]
  },
  lateMemories: {
    id: 12,
    requirement: () => Ra.totalPetLevel >= 80,
    lines: [
      "I think they are telling me to stop.",
      "You... whatever you are?",
      "What is happening?",
      "Am I doing something wrong?",
    ]
  },
  maxLevels: {
    id: 13,
    requirement: () => Ra.totalPetLevel >= Ra.maxTotalPetLevel,
    lines: [
      "Finally, I remember everything.",
      "This darkness that banished me.",
      "Lai'tela...",
      "They were right to banish me.",
      "My powers...",
      "They steal, they corrupt.",
      "Please leave.",
      "I do not want to hurt you too.",
    ]
  },
  CandN: {
    id: 14,
    lines: [
      { text: "Hi $1, I have need you to Remember two other Celestials", name: "Glitch", background: celBackground("glitch"), 1: RaMulti},
      "Huh why... I don't want to cause any more damage",
      { text: "I'm not doing it again... not to the others, I've done enough", background: flashCelestial},
      { text: "Ra it's Cante and Null... We need them...", name: "Glitch", background: celBackground("glitch")},
      "Fine, My head will hurt a lot more after this, I better be getting a Reward from this...",
    ],
  },
};
