 import { DC } from "./constants"

export function isMetaAvailable() {
  return Player.canMeta;
}

export function requestManualMeta() {
  if (!isMetaAvailable()) return;
  if (GameEnd.creditsEverClosed) return;

  if (player.options.confirmations.meta || ui.view.shiftDown) {
    Modal.meta.show();
    return;
  }
  
  startManualMeta(false);
}

export function startManualMeta() {
  if (player.options.animations.meta) {
    runMetaAnimation();
    setTimeout(processManualMeta, 3000);
  } else {
    processManualMeta();
  }
}

export function processManualMeta() {
    if (!isMetaAvailable()) return;
    beginProcessMeta();
}

export function runMetaAnimation() {
  document.getElementById("ui").style.userSelect = "none";
  document.getElementById("ui").style.animation = "a-metaze 10s 1";
  document.getElementById("realityanimbg").style.animation = "a-metazebg 10s 1";
  document.getElementById("realityanimbg").style.display = "block";
  if (Theme.current().isDark()) document.getElementById("realityanimbg").style.filter = "invert(1)";
  else document.getElementById("realityanimbg").style.filter = "";
  setTimeout(() => {
    document.getElementById("realityanimbg").play();
    document.getElementById("realityanimbg").currentTime = 0;
    document.getElementById("realityanimbg").play();
  }, 2000);
  setTimeout(() => {
    document.getElementById("ui").style.userSelect = "auto";
    document.getElementById("ui").style.animation = "";
    document.getElementById("realityanimbg").style.animation = "";
    document.getElementById("realityanimbg").style.display = "none";

  }, 10000);
}

function updateMetaRecords() {
  const tm = player.records.thisMeta;
  const thisRunMRmin = Currency.metaRelays.value.div(tm.time)
  if (player.records.bestMeta.MRmin.lt(thisRunMRmin)) player.records.bestMeta.MRmin = thisRunMRmin;
  
  player.records.bestMeta.time = Decimal.min(tm.time, player.records.bestMeta.time);
  player.records.bestMeta.realTime = Math.min(tm.realTime, player.records.bestMeta.realTime);


  tm.maxAM = DC.D0;
  tm.bestMRmin = DC.D0;
  tm.bestMRminVal = DC.D0;
  tm.time = DC.D0;
  tm.realTime = 0;

}

function giveMetaRewards() {
  Currency.metaRelays.add(gainedMetaRelays());
  Currency.metas.add(gainedMetas());
  updateMetaRecords();
}


export function beginProcessMeta() {
  EventHub.dispatch(GAME_EVENT.META_RESET_BEFORE);
  giveMetaRewards();
  finishProcessMeta();
  EventHub.dispatch(GAME_EVENT.META_RESET_AFTER);
}

// eslint-disable-next-line complexity
export function finishProcessMeta() {
  
  resetReality();
  if(!MetaMilestone.glyphKeep.isReached) lockAchievementsOnMeta();
  if(MetaFabricatorUpgrade(22).isBought){
    resetChaosDimensionsAmount();
  }
  else{
    ChaosDimensions.reset();
    Currency.chaosCores.reset();
  }
  Currency.perkPoints.reset();

  NormalChallenges.clearCompletions();
  InfinityChallenges.clearCompletions();
  player.eternityChalls = {};

  player.reality.automator.state.forceRestart = false;
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }

  Teresa.reset();
  Effarig.reset();
  Enslaved.reset();
  V.reset();
  Ra.reset();
  Laitela.reset();
  Glitch.reset();


  recalculateAllGlyphs();
  Glyphs.updateMaxGlyphCount(true);

  player.sacrificed = DC.D0;

  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.records.bestInfinity.time = new Decimal(999999999999);
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time =  new Decimal();
  player.records.thisInfinity.lastBuyTime = new Decimal();
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.records.thisEternity.time = new Decimal();
  player.records.thisEternity.realTime = 0;
  player.records.bestEternity.time = new Decimal(999999999999);
  player.records.bestEternity.realTime = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = DC.D0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;

  Player.resetRequirements("meta");

  Currency.timeTheorems.reset();
  player.dilation.studies = [];
  player.dilation.active = false;

  
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    11: 0,
    12: 0,
    13: 0
  };
  
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();

  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisReality.maxAM = DC.D0;
  player.records.thisReality.maxDT = DC.D0;

  player.dilation.lastEP = DC.DM1;
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.enslaved.hasSecretStudy = false;
  player.celestials.laitela.entropy = 0;

  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset(false);
  player.celestials.ra.peakGamespeed = DC.DM1;

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.bestEPminReality = DC.D0;
  player.records.thisReality.bestEternitiesPerMs = DC.D0;
  player.records.thisReality.bestRSmin = DC.D0;
  player.records.thisReality.bestRSminVal = DC.D0;

  player.records.thisMeta = {
    time: DC.D0,
    realTime: 0,
    maxAM: DC.D0,
    MR: DC.D0,
    bestMRmin: DC.D0,
    bestMRminVal: DC.D0,
  }

  resetTimeDimensions();
  resetTickspeed();
  AchievementTimers.marathon2.reset();
  Currency.infinityPoints.reset();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  EventHub.dispatch(GAME_EVENT.META_RESET_AFTER);

  player.reality.hasCheckedFilter = false;

  Tab.dimensions.antimatter.show()
}

function resetReality(){
  const R = player.reality;
  const G = R.glyphs;

  AlchemyResources.reset();
  
  player.records.thisReality.time = DC.D0;
  player.records.bestReality.time = DC.D0;
  player.records.thisReality.realTime = 0;
  player.records.bestReality.realTime = 0;
  player.records.thisReality.maxReplicanti = DC.D0;

  R.maxRM = DC.D0;
  R.iMCap = 0;
  R.imaginaryMachines = 0;
  R.maxRM = DC.D0;
  R.maxRM = DC.D0;

  G.sac = {
    power: DC.D0,
    infinity: DC.D0,
    time: DC.D0,
    replication: DC.D0,
    dilation: DC.D0,
    effarig: DC.D0,
    reality: DC.D0,
    glitch: DC.D0
  }
  const companions = JSON.stringify(Glyphs.allGlyphs.filter(g => g.type === "companion"));
  if(MetaMilestone.glyphKeep.isReached){
    G.active.forEach(g => g.level = 1);
    G.inventory.filter(g => g.type != "cursed").forEach(g => g.level = 1);
  } else {
    G.active = [];
    G.inventory = [];
    G.undo = [];
    G.createdRealityGlyph = false;
    JSON.parse(companions).forEach(g => {
      Glyphs.addToInventory(g);
    });
  }


  R.seed = 1;
  
  R.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
  
  R.imaginaryRebuyables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  }
  
  if(!MetaMilestone.realityStart.isReached) R.upgReqs = 0;
  R.upgradeBits = 0;
  if(!MetaMilestone.metaBoost.isReached) R.imaginaryUpgReqs = 0;
  R.imaginaryUpgradeBits = 0;

  R.reqLock = {
    reality: 0,
    imaginary: 0,
  }

  if(!MetaFabricatorUpgrade(18).isBought) R.perks = new Set();
  R.perks.add(0);
  R.respec = false;
  R.perkPoints = 0;
  R.unlockedEC = 0;
  R.lastAutoEC = DC.D0;

  R.partEternitied = DC.D0;
  R.gainedAutoAchievements = false;
  R.achTimer = DC.D0;

  Currency.realities.reset();
  Currency.realityMachines.reset();

  player.blackHole.forEach(bh => {
    bh.intervalUpgrades = MetaMilestone.metaKeepEff.isReached ? 50 : 0;
    bh.powerUpgrades = 0;
    bh.durationUpgrades = MetaMilestone.metaKeepEff.isReached ? 50 : 0;
    bh.phase = 0;
    bh.active = false;
    bh.unlocked = MetaMilestone.metaKeepEff.isReached ? true : false;
    bh.activations = 0;
  })

  player.blackHolePause = false;
  player.blackHoleNegative = DC.D1;

  player.records.timePlayedAtBHUnlock = DC.D0;
  
  player.records.thisReality = {
    time: DC.D0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    maxEP: DC.D0,
    bestEternitiesPerMs: DC.D0,
    maxReplicanti: DC.D0,
    maxDT: DC.D0,
    bestRSmin: DC.D0,
    bestRSminVal: DC.D0,
  }

  player.records.bestReality = {
    time: Decimal.NUMBER_MAX_VALUE,
    realTime: Number.MAX_VALUE,
    glyphStrength: 0,
    RM: DC.D0,
    RMSet: [],
    RMmin: DC.D0,
    RMminSet: [],
    glyphLevel: 0,
    glyphLevelSet: [],
    bestEP: DC.D0,
    bestEPSet: [],
    speedSet: [],
    iMCapSet: [],
    laitelaSet: [],
  }

}

function lockAchievementsOnMeta() {
  for (const achievement of Achievements.preMeta) {
    achievement.lock();
  }
}

// i knew you would come here, i'll just say AD-V has a story?
// Vulnerate: to cause damage; is the meaning of AD-V; it is not about the celestial V
