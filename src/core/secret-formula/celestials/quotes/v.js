const celBackground = cel => [[cel, 0]];

export const vQuotes = {
  initial: {
    id: 0,
    lines: [
      "How pathetic..."
    ],
  },
  unlock: {
    id: 1,
    lines: [
      "Welcome to my Reality.",
      "I am surprised you could reach it.",
      "This is my realm after all...",
      "Not everyone is as great as me.",
    ],
  },
  realityEnter: {
    id: 2,
    lines: [
      "Good luck with that!",
      "You will need it.",
      "My reality is flawless. You will fail.",
    ],
  },
  realityComplete: {
    id: 3,
    lines: [
      "So fast...",
      "Do not think so much of yourself.",
      "This is just the beginning.",
      {text: "It's weak here", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      {text: "But it's getting stronger", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      "You will never be better than me.",
    ],
  },
  achievement1: {
    id: 4,
    requirement: () => V.spaceTheorems.gte(1),
    lines: [
      "Only one? Pathetic.",
      "Your accomplishments pale in comparison to mine.",
    ],
  },
  achievement6: {
    id: 5,
    requirement: () => V.spaceTheorems.gte(6),
    lines: [
      "This is nothing.",
      "Do not be so full of yourself.",
    ],
  },
  hex1: {
    id: 6,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 1,
    lines: [
      "Do not think it will get any easier from now on.",
      "You are awfully proud for such a little achievement.",
    ],
  },
  achievement12: {
    id: 7,
    requirement: () => V.spaceTheorems.gte(12),
    lines: [
      "How did you...",
      "This barely amounts to anything!",
      "You will never complete them all.",
    ],
  },
  achievement24: {
    id: 8,
    requirement: () => V.spaceTheorems.gte(24),
    lines: [
      "Impossible...",
      "After how difficult it was for me...",
    ],
  },
  hex3: {
    id: 9,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 3,
    lines: [
      "No... No... No...",
      "This cannot be...",
    ],
  },
  allAchievements: {
    id: 10,
    requirement: () => V.spaceTheorems.gte(36),
    lines: [
      "I... how did you do it...",
      {text: "They have to be getting stronger.", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      "I worked so hard to get them...",
      "I am the greatest...",
      {text: "You must have cheated.", displayed: () => SecretAchievement(23).isUnlocked },
      {text: "This has to explain the corruptions.", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch'), glitched: true},
      "No one is better than me...",
      "No one... no one... no on-",
    ],
  },
  extremeUnlocked: {
    id: 11,
    lines: [
      "Destroyer, he wants me to be nice to you...",
      "You ruined all of my Achievements",
      "So... for each time you complete my Revengeance Achievement",
      "I'm getting Glitch to Dilate your Dimensions and Tickspeed",
      "I will not let YOU be better than me",
    ],
  },
  extremeFinished: {
    id: 12,
    requirement: () => V.spaceTheorems.gte(230),
    lines: [
      {text: "Y-Y-You finished", tremble: true},
      {text: "oh no", tremble: true},
      {text: "S-S-So... Glitch isn't able to stop you", tremble: true},
      {text: "Not even With y-your Dimensions and Tickspeed being Dilated", tremble: true},
      "I was never able to beat you...",
      "Please at least give me back my Achievements before you go...",
      {text: "Please give V back his Achievements, I don't want to ask again", name: "Glitch", background: [["glitch", 0]]},
      {text: "You all ready made him sad the first time", name: "Glitch", background: [["glitch", 0]]},
    ],
  },
  thankYou: {
    id: 13,
    lines: [
      "Thank you Destroyer, please don't complete them again",
    ],
  },
};
