/* eslint-disable */
// Disabling eslint here is fine, this is developer tools and this file does really matter.


import { sha512_256 } from "js-sha512";
import { Player } from "./player";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

export const dev = {};

dev.speedUp = 1

dev.hardReset = function() {
  GameStorage.hardReset();
};

dev.giveAllAchievements = function() {
  const allAchievements = Achievements.all.concat(SecretAchievements.all);
  for (const achievement of allAchievements) achievement.unlock();
};

dev.completeUpToGlitch = function() {
  player.celestials.teresa.unlockBits = 255;
  player.celestials.effarig.unlockBits = 255;
  player.celestials.enslaved.completed = true;
  player.celestials.enslaved.unlocks = [0,1];
  player.celestials.v.unlockBits = 127;
  player.celestials.v.runUnlocks = [6,8,8,8,9,9,5,6,8,7,0,0,0,0,0];
  player.celestials.ra.unlockBits = (2**36)-1;
  player.celestials.ra.pets.teresa.level = 100;
  player.celestials.ra.pets.effarig.level = 100;
  player.celestials.ra.pets.enslaved.level = 100;
  player.celestials.ra.pets.v.level = 100;
  player.celestials.ra.pets.glitchyfishys.level=100;

  player.reality.imaginaryUpgReqs = (2**26)-1;
  player.reality.imaginaryUpgradeBits = (2**26)-1;

  player.celestials.laitela.difficultyTier = 8;
  player.celestials.laitela.singularities = new Decimal(1e60);

  player.glitch.preinfinity.upgradebits=255;
  player.glitch.breakinfinity.upgradebits=255;
  player.glitch.eternity.upgradebits=255;
  player.glitch.reality.upgradebits=16383;
  
  dev.completereality();
}

dev.disableComformations = function() {
      player.options.confirmations.armageddon = false;
      player.options.confirmations.sacrifice = false;
      player.options.confirmations.challenges = false;
      player.options.confirmations.exitChallenge = false;
      player.options.confirmations.eternity = false;
      player.options.confirmations.dilation = false;
      player.options.confirmations.resetReality = false;
      player.options.confirmations.glyphReplace = false;
      player.options.confirmations.glyphSacrifice = false;
      player.options.confirmations.autoClean = false;
      player.options.confirmations.sacrificeAll = false;
      player.options.confirmations.glyphSelection = false;
      player.options.confirmations.glyphUndo = false;
      player.options.confirmations.deleteGlyphSetSave = false;
      player.options.confirmations.glyphRefine = false;
      player.options.confirmations.bigCrunch = false;
      player.options.confirmations.replicantiGalaxy = false;
      player.options.confirmations.antimatterGalaxy = false;
      player.options.confirmations.dimensionBoost = false;
      player.options.confirmations.switchAutomatorMode = false;
      player.options.confirmations.respecIAP = false;
  };

dev.completeECs = function() {
  player.eternityChalls.eterc1= Enslaved.isRunning ? 1000 : 5;
  player.eternityChalls.eterc2=5;
  player.eternityChalls.eterc3=5;
  player.eternityChalls.eterc4=5;
  player.eternityChalls.eterc5=5;
  player.eternityChalls.eterc6=5;
  player.eternityChalls.eterc7=5;
  player.eternityChalls.eterc8=5;
  player.eternityChalls.eterc9=5;
  player.eternityChalls.eterc10=5;
  player.eternityChalls.eterc11=5;
  player.eternityChalls.eterc12=5;
}
dev.disableAnimations = function() {
  player.options.animations.bigCrunch = false;
  player.options.animations.eternity = false;
  player.options.animations.dilation = false;
  player.options.animations.tachyonParticles = false;
  player.options.animations.reality = false;
  player.options.animations.background = false;
};

dev.disableOptions = function() {
  dev.disableComformations();
  dev.disableAnimations();
  player.options.automaticTabSwitching = false;
}
dev.unlockAllRealityUpgrades = function() {
  player.reality.upgReqs=(2**28)-1;
  player.reality.upgradeBits = (2**28)-1;
  player.blackHole[0].unlocked=true;
  player.blackHole[1].unlocked=true;
  Currency.realities.add(1);
}
dev.getAllPerks = function() {
  player.reality.perkPoints = player.reality.perkPoints.add(100);
  dev.buyAllPerks();
  player.realities = player.realities.add(1);
}
dev.completereality = function() {
  dev.getAllPerks();
  dev.unlockAllRealityUpgrades();
}

dev.giveLongAchievements = function() {
  player.achievementBits[2] |= 16;
  player.achievementBits[3] |= 4;
  player.achievementBits[6] |= 32;
  player.achievementBits[7] |= 64;
}

// Know that both dev.doubleEverything and dev.tripleEverything are both broken
// with this error https://i.imgur.com/ZMEBNTv.png

dev.boostEverything = function() {
  
}
    
dev.barrelRoll = function() {
  FullScreenAnimationHandler.display("a-barrel-roll", 5);
};

dev.spin3d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "a-spin3d 3s infinite";
  else document.body.style.animation = "";
};

dev.spin4d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "a-spin4d 3s infinite";
  else document.body.style.animation = "";
};

dev.cancerize = function() {
  Theme.tryUnlock("Design");
  Notation.emoji.setAsCurrent();
};

dev.fixSave = function() {
  const save = JSON.stringify(player, GameSaveSerializer.jsonConverter);
  const fixed = save.replace(/NaN/gui, "10");
  const saveData = JSON.parse(fixed);
  if (!saveData || GameStorage.checkPlayerObject(saveData) !== "") {
    Modal.message.show("Could not fix the save.");
    return;
  }
  GameStorage.loadPlayerObject(saveData);
  GameStorage.save();
};

dev.updateTDCosts = function() {
  for (let tier = 1; tier < 9; tier++) {
    const dim = TimeDimension(tier);
    dim.cost = dim.nextCost(dim.bought);
  }
};

dev.refundTimeDims = function() {
  for (const dimension of TimeDimensions.all) {
    dimension.bought = 0;
  }
  dev.updateTDCosts();
};

dev.refundEPMult = function() {
  player.epmultUpgrades = 0;
};

dev.refundDilStudies = function() {
  for (const study of GameDatabase.eternity.timeStudies.dilation) {
    if (player.dilation.studies.includes(study.id)) {
      player.dilation.studies.splice(player.dilation.studies.indexOf(study.id), 1);
      console.log(document.getElementById(`removed dilstudy${study.id}`));
      Currency.timeTheorems.add(study.cost);
    }
  }
};

dev.resetDilation = function() {
  player.dilation.dilatedTime = DC.D0;
  player.dilation.tachyonParticles = DC.D0;
  player.dilation.rebuyables[1] = 0;
  player.dilation.rebuyables[2] = 0;
  player.dilation.rebuyables[3] = 0;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
};

// We want to give a large degree of options
// when making a special glyph, so no max-params
// eslint-disable-next-line max-params
dev.giveSpecialGlyph = function(color, symbol, level, rawLevel = level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  const glyph = GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel });
  glyph.symbol = symbol;
  glyph.color = color;
  Glyphs.addToInventory(glyph);
};

dev.giveGlyph = function(level, rawLevel = level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  Glyphs.addToInventory(GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel }));
};

dev.giveRealityGlyph = function(level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  Glyphs.addToInventory(GlyphGenerator.realityGlyph());
};

dev.setCompanionGlyphEP = function(eternityPoints) {
  const glyph = player.reality.glyphs.active
    .concat(player.reality.glyphs.inventory)
    .filter(g => g.type === "companion")[0];
  glyph.strength = rarityToStrength(eternityPoints.max(1).log10() / 1e6);
};

dev.decriminalize = function() {
  SecretAchievement(23).lock();
  EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
};

dev.removeAch = function(name) {
  if (name === "all") {
    const allAchievements = Achievements.all.concat(SecretAchievements.all);
    for (const achievement of allAchievements) achievement.lock();
    return "removed all achievements";
  }
  if (typeof (name) === "number") return Achievement(name).lock();
  if (name.startsWith("r")) return Achievement(parseInt(name.slice(1), 10)).lock();
  if (name.startsWith("s")) return SecretAchievement(parseInt(name.slice(1), 10)).lock();
  return "failed to delete achievement";
};

window.nextNewsMessageId = undefined;

dev.setNextNewsMessage = function(id) {
  nextNewsMessageId = id;
};

dev.implode = function() {
  bigCrunchAnimation();
};

dev.eternify = function() {
  eternityAnimation();
};

dev.dilate = function() {
  animateAndDilate();
};

dev.undilate = function() {
  animateAndUndilate();
};

dev.realize = function() {
  runRealityAnimation();
};

dev.respecPerks = function() {
  player.reality.perkPoints = player.reality.perkPoints.add(player.reality.perks.size);
  player.reality.perks = new Set();
  GameCache.achievementPeriod.invalidate();
  GameCache.buyablePerks.invalidate();
};

export function isDevEnvironment() {
  const href = window.location.href;
  return href.split("//")[1].length > 20 || isLocalEnvironment();
}

export function isLocalEnvironment() {
  const href = window.location.href;
  return href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
}

dev.togglePerformanceStats = function() {
  PerformanceStats.toggle();
};

// Buys all perks, will end up buying semi-randomly if not enough pp
dev.buyAllPerks = function() {
  const visited = [];
  const toVisit = [Perk.firstPerk];
  while (toVisit.length > 0) {
    if (player.reality.perkPoints.lt(1)) break;
    const perk = toVisit.shift();
    visited.push(perk);
    toVisit.push(...perk.connectedPerks.filter(p => !visited.includes(p)));
    perk.purchase();
  }
};

// This should help for balancing different glyph types, strong rounding of values is intentional
dev.printResourceTotals = function() {
  console.log(`Antimatter: e${Currency.antimatter.exponent.toPrecision(3)}`);
  console.log(`RM: e${Math.round(MachineHandler.gainedRealityMachines.log10())}`);
  console.log(`Glyph level: ${100 * Math.floor(gainedGlyphLevel().actualLevel / 100 + 0.5)}`);

  console.log(`Tickspeed: e${-Tickspeed.current.exponent.toPrecision(3)}`);
  console.log(`Gamespeed: ${Math.pow(getGameSpeedupFactor(), 1.2).toPrecision(1)}`);
  const aGalaxy = 100 * Math.floor(player.galaxies / 100 + 0.5);
  const rGalaxy = 100 * Math.floor(Replicanti.galaxies.total / 100 + 0.5);
  const dGalaxy = 100 * Math.floor(player.dilation.totalTachyonGalaxies / 100 + 0.5);
  console.log(`Galaxies: ${aGalaxy}+${rGalaxy}+${dGalaxy} (${aGalaxy + rGalaxy + dGalaxy})`);
  console.log(`Tick reduction: e${-Math.round(getTickSpeedMultiplier().log10())}`);

  let ADmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    ADmults = ADmults.times(AntimatterDimension(i).multiplier);
  }
  console.log(`AD mults: e${ADmults.log10().toPrecision(3)}`);
  let IDmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    IDmults = IDmults.times(InfinityDimension(i).multiplier);
  }
  console.log(`ID mults: e${IDmults.log10().toPrecision(3)}`);
  let TDmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    TDmults = TDmults.times(TimeDimension(i).multiplier);
  }
  console.log(`TD mults: e${TDmults.log10().toPrecision(3)}`);
  console.log(`Tickspeed from TD: ${formatWithCommas(Decimal.floor(player.totalTickGained.div(1000).add(0.5)).mul(1000))}`);

  console.log(`Infinities: e${Math.round(player.infinities.log10())}`);
  console.log(`Eternities: e${Math.round(player.eternities.log10())}`);
  console.log(`Replicanti: e${formatWithCommas(1e5 * Math.floor(Replicanti.amount.log10() / 1e5 + 0.5))}`);

  console.log(`TT: e${Math.round(player.timestudy.theorem.log10())}`);
  console.log(`DT: e${Math.round(player.dilation.dilatedTime.log10())}`);
  console.log(`TP: e${Math.round(player.dilation.tachyonParticles.log10())}`);
};

dev.unlockCelestialQuotes = function(celestial) {
  Quotes[celestial].all.forEach(x => x.show());
};

dev.presentCelestialQuotes = function(celestial) {
  Quotes[celestial].all.forEach(x => x.present());
};

// This doesn't check everything but hopefully it gets some of the more obvious ones.
dev.testReplicantiCode = function(singleId, useDebugger = false) {
  const situationLists = [
    [
      function() {
        player.infinities = DC.E12;
        player.celestials.effarig.unlockBits = 64;
      }
    ],
    [
      function() {
        player.replicanti.interval = 1;
      }
    ],
    [
      function() {
        player.timestudy.studies.push(33);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(62);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(131);
      },
      function() {
        player.timestudy.studies.push(132);
      },
      function() {
        player.timestudy.studies.push(133);
      },
      function() {
        player.timestudy.studies.push(131, 132, 133);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(192);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(213);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(225);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(226);
      }
    ],
    [
      function() {
        player.achievementBits[8] |= 16;
      }
    ],
    [
      function() {
        player.achievementBits[12] |= 8;
      }
    ],
    [
      function() {
        player.achievementBits[12] |= 128;
      }
    ],
    [
      function() {
        player.reality.perks = new Set([32]);
      }
    ],
    [
      function() {
        Autobuyer.replicantiGalaxy.isActive = true;
      }
    ],
    [
      function() {
        Replicanti.galaxies.isPlayerHoldingR = true;
      }
    ],
    [
      function() {
        player.replicanti.boughtGalaxyCap = 100;
      },
      function() {
        player.replicanti.boughtGalaxyCap = 100;
        player.replicanti.galaxies = 50;
      }
    ],
    [
      function() {
        player.reality.upgReqs = (1 << 6);
        player.reality.upgradeBits = 64;
      }
    ]
  ];
  const situationCount = situationLists.map(x => x.length + 1).reduce((x, y) => x * y);
  const resultList = [];
  const runSituation = function(id) {
    Replicanti.galaxies.isPlayerHoldingR = false;
    GameStorage.loadPlayerObject(Player.defaultStart);
    player.infinities = DC.D1;
    player.infinityPoints = DC.E150;
    Replicanti.unlock();
    player.replicanti.chance = 1;
    for (let i = 0; i < situationLists.length; i++) {
      const div = situationLists.slice(0, i).map(x => x.length + 1).reduce((x, y) => x * y, 1);
      // eslint-disable-next-line no-empty-function
      const situation = [() => {}].concat(situationLists[i])[Math.floor(id / div) % (situationLists[i].length + 1)];
      situation();
    }
    function doReplicantiTicks() {
      for (let j = 0; j <= 5; j++) {
        replicantiLoop(Math.pow(10, j));
        resultList.push(Notation.scientific.formatDecimal(Replicanti.amount, 5, 5));
        resultList.push(player.replicanti.galaxies);
        resultList.push(Replicanti.galaxies.total);
      }
    }
    doReplicantiTicks();
    player.antimatter = DC.E309;
    player.records.thisInfinity.maxAM = DC.E309;
    bigCrunchReset();
    doReplicantiTicks();
  };
  if (singleId === undefined) {
    const total = 4000;
    const p = 10007;
    if (total * p < situationCount) {
      throw new Error("Prime p is not large enough to go through all situations.");
    }
    for (let i = 0; i < total; i++) {
      const actual = i * p % situationCount;
      if (i % 100 === 0) {
        console.log(`Considering situation #${i}/${total} (${actual})`);
      }
      runSituation(actual);
    }
  } else {
    runSituation(singleId);
  }
  const hash = sha512_256(resultList.toString());
  console.log(hash);
  if (useDebugger) {
    // eslint-disable-next-line no-debugger
    // debugger; remeber to undo this
  }
  return hash;
};

dev.testGlyphs = function(config) {
  const glyphLevel = config.glyphLevel || 6500;
  const duration = config.duration || 4000;
  let glyphId = Date.now();
  const save = GameSaveSerializer.serialize(player);
  const makeGlyph = (type, effects) => ({
    type,
    level: glyphLevel,
    strength: 3.5,
    rawLevel: glyphLevel,
    idx: null,
    id: glyphId++,
    effects: makeGlyphEffectBitmask(effects),
  });
  const makeAllEffectGlyph = type => makeGlyph(type, GlyphTypes[type].effects.map(e => e.id));
  const effarigGlyphs = [
    makeGlyph("effarig", ["effarigantimatter", "effarigdimensions", "effarigforgotten", "effarigblackhole"]),
    makeGlyph("effarig", ["effarigantimatter", "effarigdimensions", "effarigforgotten", "effarigachievement"]),
  ];
  function makeCombinationsWithRepeats(count, elements) {
    if (elements.length === 0) return [];
    if (count === 0) return [[]];
    const withoutFirst = makeCombinationsWithRepeats(count, elements.slice(1));
    const withFirst = makeCombinationsWithRepeats(count - 1, elements);
    withFirst.forEach(e => e.push(elements[0]));
    return withFirst.concat(withoutFirst);
  }
  const sets5 = makeCombinationsWithRepeats(5, GlyphInfo.basicGlyphTypes)
    .map(s => s.map(t => makeAllEffectGlyph(t)));
  const sets4 = makeCombinationsWithRepeats(4, GlyphInfo.basicGlyphTypes)
    .map(s => s.map(t => makeAllEffectGlyph(t)));
  const effarigSets = effarigGlyphs.map(g => sets4.map(s => [g].concat(s)));
  const glyphSets = sets5.concat(...effarigSets);
  function equipSet(index) {
    player.reality.glyphs.active = glyphSets[index].map((g, idx) => {
      g.idx = idx;
      return g;
    });
    Glyphs.active = Array.from(player.reality.glyphs.active);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  }
  function glyphToShortString(glyph) {
    if (glyph.type === "effarig") {
      return effarigGlyphs.findIndex(e => e.id === glyph.id).toString();
    }
    return GLYPH_SYMBOLS[glyph.type];
  }
  function padString(s, length, before = false) {
    if (s.length >= length) return s;
    return before ? (" ").repeat(length - s.length) + s : s + (" ").repeat(length - s.length);
  }
  function finishTrial(index) {
    const done = padString(`${Math.floor(100 * (index + 1) / glyphSets.length)}%`, 4, true);
    const rm = padString(MachineHandler.gainedRealityMachines.toPrecision(2), 9);
    const gl = padString(gainedGlyphLevel().actualLevel, 4);
    const ep = padString(player.eternityPoints.exponent.toString(), 6);
    const ip = padString(player.infinityPoints.exponent.toString(), 8);
    const am = padString(Currency.antimatter.exponent.toString(), 12);
    const dimboosts = DimBoost.purchasedBoosts;
    const galaxies = Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies;
    const glyphData = glyphSets[index].map(glyphToShortString).sum();
    console.log(`${done} ${glyphData} rm=${rm} gl=${gl} ep=${ep} ip=${ip} am=${am} ` +
      `dimboosts=${dimboosts} galaxies=${galaxies}`);
    GameStorage.offlineEnabled = false;
    GameStorage.import(save);
    if (index < glyphSets.length - 1) {
      setTimeout(runTrial, 100, index + 1);
    }
  }
  function runTrial(index) {
    equipSet(index);
    AutomatorBackend.start();
    setTimeout(finishTrial, duration, index);
  }
  runTrial(0);
};

// May want to make this command in particular publicly known if automator gating is a common complaint post-release
dev.unlockAutomator = function() {
  player.reality.automator.forceUnlock = true;
};

// This bypasses any conflict checking and forces the current save to overwrite the cloud save. This largely exists
// because normal cloud saving checks for a conflict and then always shows a modal if a conflict is found, only actually
// saving if the player says to in the modal. The check can fail if the cloud save is somehow malformed and missing
// props. This can lead to the check always failing, the modal never showing up, and cloud saving never occurring. That
// should in principle only show up in dev, as migrations aren't run on cloud saves, but this allows fixing in case.
dev.forceCloudSave = async function() {
  const save = await Cloud.load();
  const root = GameSaveSerializer.deserialize(save);
  const saveId = GameStorage.currentSlot;
  if (!root.saves) root.saves = [];
  root.saves[saveId] = GameStorage.saves[saveId];
  Cloud.save(saveId);
};

// TODO Figure out if we want to remove this before release
dev.unlockAllCosmeticSets = function() {
  player.reality.glyphs.cosmetics.unlockedFromNG = Object.keys(GameDatabase.reality.glyphCosmeticSets);
};

// You would never guess what these are for
dev.beTests = {}

dev.beTests.speed = (speed) =>  {
  dev.speedUp = new Decimal(speed);
}

dev.beTests.consecutiveInfinities = function(amnt) {
  player.infinityPoints = player.infinityPoints.add(gainedInfinityPoints().times(amnt))
  player.infinities = player.infinities.add(gainedInfinities().round())
}

dev.beTests.completeChalleges = {}

dev.beTests.completeChalleges.normal = function() {
  for (let i = 1; i < 13; i++) NormalChallenge(i).complete()
}

dev.beTests.completeChalleges.infinity = function() {
  for (let i = 1; i < 9; i++) InfinityChallenge(i).complete()
}

dev.beTests.completeChalleges.eternity = function () {
  for (let i = 1; i < 13; i++) EternityChallenge(i).completions = (i == 1 && Enslaved.isRunning) ? 1000: 5
}

dev.beTests.completeChalleges.all = function () {
  dev.beTests.completeChalleges.normal()
  dev.beTests.completeChalleges.infinity()
  dev.beTests.completeChalleges.eternity()
}

dev.beTests.nanFuckIteration = function (value, value2) {
  for (const item in value) {
    console.log(value[item])
    console.log(value2[item])
    if (value[item] instanceof Decimal && value2[item] != undefined) {
      if (value2[item].neq(0)) {
        if (value[item].lt(0) || value[item].layer > 8e15)
          value[item] = value2[item]
      } else {
        if (value[item].layer > 8e15)
          value[item] = value2[item]
      }
    }
    if (value[item] instanceof Number && value2[item] != undefined) {
      if (value2[item] == 0) {
        if (value[item] > 1e300) {
          value[item] = value2[item]
        }
      } else {
        if (value[item] > 1e300 || value[item] < 0) {
          value[item] = value2[item]
        }
      }
    }
    if ((value[item] instanceof Object || value[item] instanceof Array) && !(value[item] instanceof Decimal) && value2[item] != undefined)
      value[item] = dev.beTests.nanFuckIteration(value[item], value2[item])
    if (value[item] == undefined  && value2[item] != undefined)
      value[item] = value2[item]
  }
  return value
}

dev.beTests.nanFuck = function () {
  player = dev.beTests.nanFuckIteration(player, Player.defaultStart)
  GameStorage.save()
}

dev.beTests.prepare = function (completeAllChallenges = false) {
  if(completeAllChallenges) dev.beTests.completeChalleges.all()
  else dev.beTests.completeChalleges.normal()

  dev.beTests.consecutiveInfinities(new Decimal("1e350"))
  dev.beTests.speed()
  GameStorage.import("blob")
  Notation.scientific.setAsCurrent()
  Achievement(61).unlock()
}