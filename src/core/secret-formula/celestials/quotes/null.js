const Matter = ["Antimatter", "Pseudomatter", "Nullmatter", "Realmatter"];

const celBackground = cel => [[cel, 0]];

export const nullQuotes = {
  show: {
    id: 0,
    lines: [
      "...",
      "What are you doing here?",
      "You can do anything.",
      "And yet your here.",
      "WHAT DO YOU WANT!",
      "GLITCH ARE YOU THE REASON.",
      {text: "Null what are you doing to them?", name: "Glitch", background: celBackground('glitch')},
      "UGH. Go away.",
      "They are not ready.",
      {text: "I thnk you missing something?", displayed: () => !CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch')},
      {text: "After all, You can not create without destroying.", displayed: () => CanteUpgrades.all[19].isUnlocked, glitched: true},
      {text: "A code?", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch')},
      {text: "Look out for Glitched things Null says. You may have to remove some words. It might help you find the code.", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch')},
      {text: "I can't help anymore that that.", displayed: () => CanteUpgrades.all[19].isUnlocked, name: "Glitch", background: celBackground('glitch')},
    ],
  },
  parallax1: {
    id: 1,
    lines: [
      "You are really annoying.",
      "Why don't you just leave.",
      {text: "Stop this Nonsense NOW.", glitched: true},
      "...",
      "You are being force to do this aren't you?",
      "I don't want you here",
      "My Parallaxes are perfect.",
    ],
  },
  parallax2: {
    id: 2,
    lines: [
      "WHY ARE YOU DOING THIS!",
      "I HAVE DONE NOTHING TO YOU!",
      {text: "Enough Null.", name: 'Glitch', background: celBackground('glitch')},
      "...",
      {text: "Why are you looking at me like that?", name: 'Glitch', background: celBackground('glitch')},
      {text: "This is the one you wanted. Is it not?", name: 'Glitch', background: celBackground('glitch')},
      {text: "They are barely even the right person.", glitched: true},
      "Both of you can leave.",
      "I would just erase you otherwise.",
    ],
  },
  parallax3: {
    id: 3,
    lines: [
      "...",
      "Good Luck."
    ],
  },
  enrage: {
    id: 4,
    lines: [
      "YOU!",
      "WHY CAN'T YOU JUST LEAVE.",
      "Go do something else.",
      "Why do you persist?"
    ]
  },
  outrage: {
    id: 5,
    lines: [
      "ENOUGH.",
      "YOU CAN GO AWAY.",
      "THERE IS NOTHING FOR YOU.",
      "YOU. MAKE YOUR WAY HERE JUST TO ANNOY ME?",
      "AND FOR NO OTHER REASON?",
      "WHAT IS THE POINT?",
      "... LEAVE NOW!"
    ]
  },
  end: {
    id: 6,
    lines: [
      "...",
      "What is there to say?",
      "You just can't stop, Can you.",
      "Just two left before you go away.",
      "You'll have to find the others yourself",
      "...",
      "You can leave now.",
      "Go on your wasting time.",
      "Go back to Ra..."
    ]
  }
};
