import { DC } from "../../constants";
import { Currency } from "../../currency";

// This is supposed to be in ./navigation.js but importing doesn't work for some stupid reason
function emphasizeEnd(fraction) {
  return Math.pow(fraction, 10);
}

export const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2,
  POWER: 3
};

const STreq = [110,145,190,225];

export const v = {
  // Note: mainUnlock IDs here are one-indexed to match with navigation indices
  mainUnlock: {
    realities: {
      id: 1,
      name: "Realities",
      resource: () => Currency.realities.value,
      requirement: 5000,
      format: x => formatInt(x),
      progress: () => Currency.realities.value / 5000,
    },
    eternities: {
      id: 2,
      name: "Eternities",
      resource: () => Currency.eternities.value,
      requirement: 1e65,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.eternities.value.pLog10() / 65),
    },
    infinities: {
      id: 3,
      name: "Infinities",
      resource: () => Currency.infinitiesTotal.value,
      requirement: 1e150,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.infinitiesTotal.value.pLog10() / 150),
    },
    dilatedTime: {
      id: 4,
      name: "Dilated Time",
      resource: () => player.records.thisReality.maxDT,
      requirement: DC.E300,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxDT.pLog10() / 300),
    },
    replicanti: {
      id: 5,
      name: "Replicanti",
      resource: () => player.records.thisReality.maxReplicanti,
      requirement: DC.E300000,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxReplicanti.pLog10() / 300000),
    },
    realityMachines: {
      id: 6,
      name: "Reality Machines",
      resource: () => Currency.realityMachines.value,
      requirement: 1e55,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.realityMachines.value.pLog10() / 55),
    },
    antimatter: {
      id: 7,
      name: "Antimatter",
      resource: () => Currency.antimatter.value,
      requirement: DC.E5000000000,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.antimatter.value.pLog10() / 100000000),
    },
  },
  runUnlocks: [
    {
      id: 0,
      name: "Glyph Knight",
      description: value => `Unlock Reality with at most ${quantifyInt("Glyph", -value)} equipped.`,
      // This achievement has internally negated values since the check is always greater than
      values: [-5, -4, -3, -2, -1, 0],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -Glyphs.activeWithoutCompanion.length,
      formatRecord: x => (x >= -5 ? formatInt(-x) : "Not reached"),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${formatInt(value)} total Galaxies from all types.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500, 10000, 20000],
      condition: () => V.isRunning,
      currentValue: () => Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(300 * tiers),
      maxShardReduction: goal => goal - 4000,
      perReductionStep: 10,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${format(Decimal.pow10(value))} Infinity Points in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6, 1e9, 1.5e11],
      condition: () => V.isRunning && EternityChallenge(7).isRunning,
      currentValue: () => Currency.infinityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 1.2e5 * tiers,
      maxShardReduction: goal => goal - 6e5,
      perReductionStep: DC.E2000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${format(Decimal.pow10(value))} Antimatter in Eternity Challenge 12 without
        unlocking Time Dilation.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6, 400e9, 10e12],
      condition: () => V.isRunning && EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked(),
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x)),
      shardReduction: tiers => 50e6 * tiers,
      maxShardReduction: goal => goal - 400e6,
      perReductionStep: DC.E1500000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${format(Decimal.pow10(value))} Eternity Points.`,
      values: [7000, 7600, 8200, 8800, 9400, 10000, 25000, 1e5, 1e7],
      condition: () => V.isRunning,
      currentValue: () => Currency.eternityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 600 * tiers,
      maxShardReduction: goal => goal - 7000,
      perReductionStep: 1e7,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${formatInt(value)} Dimension Boosts while Dilated and inside Eternity Challenge 5.`,
      values: [50, 51, 52, 53, 54, 55, 67, 72, 80],
      condition: () => V.isRunning && player.dilation.active && EternityChallenge(5).isRunning,
      currentValue: () => DimBoost.purchasedBoosts,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(tiers),
      maxShardReduction: () => 5,
      reductionStepSize: 100,
      perReductionStep: 1,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Requiem for a Glyph",
      description: value => `Unlock Reality with at most ${formatInt(-value)} Glyphs equipped for the entire Reality.`,
      // This achievement has internally negated values since the check is always greater than
      values: [1, 4, 7, 10, 13],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -player.requirementChecks.reality.maxGlyphs,
      formatRecord: x => formatInt(-x),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Post-destination",
      description: value => `Get ${formatInt(400000)} Time Theorems with a /${format(Decimal.pow10(value), 2, 2)}
        Black Hole or slower, without discharging or entering EC12.`,
      values: [ 50, 100, 150, 200, 250, 300],
      condition: () => V.isRunning  && Ra.unlocks.unlockHardV.isUnlocked,
      currentValue: () => (
        // Dirty hack I know lmao
        Currency.timeTheorems.gte(400000)
          ? -Decimal.log10(player.requirementChecks.reality.slowestBH)
          : 0),
      formatRecord: x => `${formatInt(1)} / ${format(Math.pow(10, x))}`,
      shardReduction: tiers => 50 * tiers,
      maxShardReduction: goal => goal - 50,
      reductionStepSize: 2,
      perReductionStep: 15,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 8,
      name: "Shutter Glyph",
      description: value => `Reach a Glyph of level ${formatInt(value)}.`,
      values: [6500, 7000, 8000, 9000, 10000, 15000, 20000, 25000],
      condition: () => V.isRunning && Ra.unlocks.unlockHardV.isUnlocked,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(500 * tiers),
      maxShardReduction: () => 500,
      perReductionStep: 15,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 9,
      name: "Corruption",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Antimatter without time studies or dilation unlocked`,
      values: [1e9, 5e9, 1e10, 5e10, 1e11, 5e11, 1e12],
      condition: () => V.isRunning && player.timestudy.studies.length == 0 && !PlayerProgress.dilationUnlocked()  && Ra.unlocks.unlockHardV.isUnlocked,
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 5 * (tiers * 33),
      maxShardReduction: goal => goal - (goal * 0.8),
      perReductionStep: 15,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 10,
      name: "Revengeance",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Antimatter in Glitch's Reality with V's Reality Enabled, you also need  ${STreq[VRunUnlock(10).completions]} ST<br> 
      <span style="color: var(--color-bad)">completing this will have dire consequences</span>`,
      values: [1e40, 1e42, 5e42, 2.5e40],
      condition: value => V.isRunning && Glitch.isRunning && V.isExtreme && V.spaceTheorems >= STreq[VRunUnlock(10).completions] && Currency.antimatter.value.log10() > value,
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 5 ** (tiers * 33),
      maxShardReduction: goal => goal - (goal * 0.8),
      perReductionStep: 5,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
    {
      id: 11,
      name: "Antimatter Outrage",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Antimatter in V's Extreme Reality with more at least one Revengeance Completion`,
      values: [1.8e8, 3e9, 1e10, 36e13],
      condition: () => V.isRunningExtreme && V.isExtreme && VRunUnlock(10).completions > 0,
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 25 ** (tiers * 33),
      maxShardReduction: goal => goal * 0.8,
      perReductionStep: 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
    {
      id: 12,
      name: "Infinity Enragement",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Infinity Points in V's Extreme Reality without unlocking Dilation, with more at least one Revengeance Completion`,
      values: [1e8, 1e9, 1e10, 1e12],
      condition: () => V.isRunningExtreme && V.isExtreme && VRunUnlock(10).completions > 0 && !PlayerProgress.dilationUnlocked(),
      currentValue: () => Currency.infinityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 25 ** (tiers * 33),
      maxShardReduction: goal => goal - (goal * 0.8),
      perReductionStep: 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
    {
      id: 13,
      name: "Eternity Dred",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Eternity Points in V's Extreme Reality without buying Any TimeStudies, with more at least two Revengeance Completions`,
      values: [3900, 6000, 10000, 38e4],
      condition: () => V.isRunningExtreme && V.isExtreme && VRunUnlock(10).completions > 1 && player.requirementChecks.reality.maxStudies == 0,
      currentValue: () => Currency.eternityPoints.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 25 ** (tiers * 33),
      maxShardReduction: goal => goal - (goal * 0.85),
      perReductionStep: 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
    {
      id: 14,
      name: "Dilated Escape",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Antimatter in V's Extreme Reality in Dilation in EC11, with more at least two Revengeance Completions`,
      values: [3e3, 7e3, 12e4, 31e4],
      condition: () => V.isRunningExtreme && V.isExtreme && VRunUnlock(10).completions > 1 && player.dilation.active && EternityChallenge(11).isRunning,
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 25 ** (tiers * 33),
      maxShardReduction: goal => goal - (goal * 0.85),
      perReductionStep: 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
    {
      id: 15,
      name: "Glitch's Reinforcement",
      description: value => `Reach ${format(Decimal.pow10(value), 2)} Antimatter in V's Extreme Reality with a ${format(1e10)} negitive black hole and ${(VRunUnlock(15).completions > 0) ? 3 : 4} Cursed Glyphs, with three Revengeance Completions`,
      values: [3e2, 9e3, 24e3, 4e3],
      condition: () => V.isRunningExtreme && V.isExtreme && VRunUnlock(10).completions > 2 && -Decimal.log10(player.requirementChecks.reality.slowestBH) >= 10 && player.requirementChecks.reality.maxGlyphs < ((VRunUnlock(15).completions > 0) ? -6 : -10),
      currentValue: () => Currency.antimatter.value.log10(),
      formatRecord: x => format(x, 2),
      shardReduction: tiers => 250 * (tiers * 10),
      maxShardReduction: goal => goal - (goal * 0.2),
      perReductionStep: 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isExtreme: true
    },
  ],
  unlocks: {
    vAchievementUnlock: {
      id: 0,
      reward: "Unlock V, The Celestial Of Achievements",
      description: "Meet all the above requirements simultaneously",
      requirement: () => Object.values(GameDatabase.celestials.v.mainUnlock).every(e => e.progress() >= 1)
    },
    shardReduction: {
      id: 1,
      reward: `You can spend Perk Points to reduce the goal requirement of all tiers of each V-Achievement.`,
      description: () => `Have ${formatInt(2)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 2
    },
    adPow: {
      id: 2,
      reward: "Antimatter Dimension power based on total Space Theorems.",
      description: () => `Have ${formatInt(5)} V-Achievements`,
      effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
      format: x => formatPow(x, 3, 3),
      requirement: () => V.spaceTheorems >= 5
    },
    fastAutoEC: {
      id: 3,
      reward: "Achievement multiplier reduces Auto-EC completion time.",
      description: () => `Have ${formatInt(10)} V-Achievements`,
      effect: () => Achievements.power,
      // Base rate is 60 ECs at 20 minutes each
      format: x => (Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied
        ? "Instant (Ra upgrade)"
        : `${TimeSpan.fromMinutes(60 * 20 / x).toStringShort()} for full completion`),
      requirement: () => V.spaceTheorems >= 10
    },
    autoAutoClean: {
      id: 4,
      reward: "Unlock the ability to Automatically Purge Glyphs on Reality.",
      description: () => `Have ${formatInt(16)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 16
    },
    achievementBH: {
      id: 5,
      reward: "Achievement multiplier affects Black Hole power.",
      description: () => `Have ${formatInt(30)} V-Achievements`,
      effect: () => Achievements.power,
      format: x => formatX(x, 2, 0),
      requirement: () => V.spaceTheorems >= 30
    },
    raUnlock: {
      id: 6,
      reward() {
        return `Reduce the Space Theorem cost of Time Studies by ${formatInt(2)}.
                Unlock Ra, Celestial of the Forgotten.`;
      },
      description: () => `Have ${formatInt(36)} V-Achievements`,
      effect: 2,
      requirement: () => V.spaceTheorems >= 36
    },
    gamespeedPower: {
      id: 7,
      reward() {
        return `Gamespeed power based on total STs.`;
      },
      description: () => `Have ${formatInt(125)} V-Achievements`,
      effect: () => 1 + (V.spaceTheorems ** 0.8) / 120,
      format: x => formatPow(x, 2, 2),
      requirement: () => V.spaceTheorems >= 125,
    },
    RMcap: {
      id: 8,
      reward: () => `Increase the RM cap based on total STs. you can make a Glitch glyph`,
      description: () => `Have ${formatInt(140)} V-Achievements`,
      effect: () => Math.max(V.spaceTheorems,1),
      format: x => formatPow(x, 2, 2),
      requirement: () => V.spaceTheorems >= 140,
    },
    TScap: {
      id: 9,
      reward: () => `Increase the Free Tickspeed softcap by STs.`,
      description: () => `Have ${formatInt(150)} V-Achievements and ${format("1e1E40")} antimatter`,
      effect: () => Decimal.max(Decimal.pow(2, V.spaceTheorems - 130),1),
      format: x => formatX(x, 2, 2),
      requirement: () => V.spaceTheorems >= 150 && Currency.antimatter.gte("1e1E40"),
    },
    glyphCap: {
      id: 10,
      reward: () => `Increase the Teresa Glyph Level cap to 15% per upgrade and triple Glyph Refinement`,
      description: () => `Have ${formatInt(165)} V-Achievements`,
      effect: 3,
      format: x => formatX(x, 2, 2) + ", 15%",
      requirement: () => V.spaceTheorems >= 165,
    },
    newStudies: {
      id: 11,
      reward: () => `New Triad Studies that scale based on TS`,
      description: () => `Have ${formatInt(200)} V-Achievements`,
      effect: 3,
      format: x => "3 New Studies",
      requirement: () => V.spaceTheorems >= 200,
    },
    prestigious: {
      id: 12,
      reward: () => `Unlock a new Layer (NYI)`,
      description: () => `Have ${formatInt(230)} V-Achievements`,
      effect: 3,
      format: x => "New Prestige",
      requirement: () => V.spaceTheorems >= 230,
    },
  }
};
