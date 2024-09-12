
const Pelle = ["Pelle", "Creater", "Master"];
const V = ["V", "Vulnor", "Vanquish"];
const Glitch = ["Glitch", "Galinar", "Devastator"];
const Power = ["Power", "Strength", "Frightment", "Fear"];
const Destroy = ["Destroy", "Annihilate", "Eliminate", "Remove"];

const celBackground = cel => [[cel, 0]];
const primaryBackground = cel => [["glitch", 1.5],[cel, 1.5]];


export const glitchQuotes = {
  start: {
    id: 0,
    lines: [
      "Hello \"Destroyer\"",
      "Are you the one to help me?",
      "Let's see..."
    ],
  },
  dimBoost: {
    id: 1,
    lines: [
      "Well, you're going fast",
      "Hmm",
      "Is it really you? After all this time"
    ],
  },
  dimEight: {
    id: 2,
    lines: [
      "Only Eight Dimensions?",
      "It looks like your the one",
      "It took so long to find you",
      "Welcome Destroyer, There is a lot to cover"
    ],
  },
  galaxy: {
    id: 3,
    lines: [
      "Ah yes Galaxies, Thier a bit strange",
      "Let's just say that your Dimensions are not effected by them exactly",
      "They boost Tickspeed (I made that for you), the effect of mass",
      "Getting more is harder due to how big they are",
      "You have no idea how much room they take up"
    ],
  },
    infinity: {
    id: 4,
    lines: [
      "So fast",
      "It is going to be fun, you and me are going to stop HIM",
      "... I'll come back when you have Infinited fast enough"
    ],
  },
  break: {
    id: 5,
    lines: [
      "Good you found it",
      "I hope that didn't take long",
      "The next thing you need is Replacanti",
      "It's something I made (with help) to fill up space, though it has it's limits"
    ],
  },
  eternity: {
    id: 6,
    lines: [
      "You may have completed Challenges getting here",
      "Don't worry there's more for you, have fun completing them all",
      "Also the Time Studies I have designed for you, they will help a lot",
      "I will let you make some later"
    ],
  },
  dilation: {
    id: 7,
    lines: [
      "I want to see the limit of your power",
      "I want to watch it grow beyond not just Infinity or Eternity, Everything",
      "You will need it to beat HIM"
    ],
  },
  reality: {
    id: 8,
    lines: [
      "You know what to do",
      "Just get to it",
      "Huh, These upgrades can be locked for some reason, I don't know who did it, Do You?"
    ],
  },
  celestials: {
    id: 9,
    lines: [
      "Now \"Destroyer\" I reqiure you to go in this order, for the best outcome",
      "Teresa, Effarig, Nameless one though I call them Vela, V (yes that is his name), Ra, Lai'tela",
      { text: "Then you will show me your power before $1.", 1: Pelle },
      "Haha, the power might be enough, I will be back for my Reality"
    ],
  },
  glitchReality: {
    id: 10,
    lines: [
      "Hey \"Destroyer\", can you complete my reality with all the others realitys combined?",
      { text: "You would need this $1 to $2 HIM.", 1: Power, 2: Destroy },
      "Also you may have notice me saying \"HIM\" a lot he's one of the most powerful celestials, I can't say his name here",
      "I must be careful, I have been a bit strange",
      "Huh? these upgrades are broken, take your time to fix them I'll be waiting"
    ],
  },
  glitchFinishPowerUGs: {
    id: 11,
    lines: [
      "You have done well \"Destroyer\"",
      { text: "However $1 is next", 1: Pelle},
      "Pelle... he's not from here, Let me look around for awhile",
      "Hmm... Pelle?"
    ],
  },
  glitchBuySpeed4: {
    id: 12,
    lines: [
      { text: "Hello $1", name: "Glitch", 1: V},
      "I have a request",
      { text: "What? Why?", name: "V", background: celBackground("v")},
      { text: "Who are you?", name: "V", background: celBackground("v")},
      { text: "I am $1 the Celestial of Programing, hence the name", celestialName: "Glitch", 1: Glitch},
      { text: "What do you want..?", name: "V", background: celBackground("v")},
      { text: "You Want ME TO HELP THE DESTROYER DON'T YOU", name: "V", background: celBackground("v")},
      { text: "Yes that's it, I will explain what for later, for now can you please help", name: "Glitch"},
      { text: "Only if they do not ruin the last of my Achievements", name: "V", background: celBackground("v")},
      { text: "Thanks V, I will give them access to my Chaos Dimensions", name: "Glitch"},
      { text: "Very well, you better be watching them", name: "V", background: celBackground("v")},
      "Ok, Destroyer as long as you don't ruin his Achievements you don't have anything to worry about",
      "I will see you soon very soon... or after you finish with him",
    ],
  },
};
