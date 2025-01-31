import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const IP = {
  total: {
    name: "Total IP Gained on Infinity",
    displayOverride: () => (Player.canCrunch
      ? format(gainedInfinityPoints(), 2, 2)
      : "Cannot Crunch"),
    // This effectively hides everything if the player can't actually gain any
    multValue: () => (Player.canCrunch ? gainedInfinityPoints() : DC.D1),
    isActive: () => PlayerProgress.infinityUnlocked() || Player.canCrunch,
    dilationEffect: () => (Laitela.isRunning ? Decimal.mul(0.75, Effects.product(DilationUpgrade.dilationPenalty, GlitchSpeedUpgrade(1))) : DC.D1),
    isDilated: true,
    overlay: ["∞", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: "Base Infinity Points",
    isBase: true,
    fakeValue: DC.D5,
    multValue: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return Decimal.pow10(player.records.thisInfinity.maxAM.log10().div(div.sub(0.75)));
    },
    isActive: () => player.break,
    icon: MultiplierTabIcons.CONVERT_FROM("AM"),
  },
  antimatter: {
    name: "Infinity Points from Antimatter",
    displayOverride: () => `${format(player.records.thisInfinity.maxAM, 2, 2)} AM`,
    // Just needs to match the value in base and be larger than 1
    multValue: DC.D5,
    isActive: () => player.break,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  divisor: {
    name: "Formula Improvement",
    displayOverride: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return `log(AM)/${formatInt(308)} ➜ log(AM)/${format(div, 2, 1)}`;
    },
    powValue: () => Decimal.div(308, Effects.min(308, Achievement(103), TimeStudy(111))),
    isActive: () => Achievement(103).canBeApplied || TimeStudy(111).isBought,
    icon: MultiplierTabIcons.DIVISOR("IP"),
  },
  infinityUpgrade: {
    name: () => `Infinity Upgrade - Repeatable ${formatX(2)} IP`,
    multValue: () => InfinityUpgrade.ipMult.effectOrDefault(1),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("infinity"),
  },
  achievement: {
    name: "Achievements",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "Time Studies",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  dilationUpgrade: {
    name: "Dilation Upgrade - IP multiplier based on DT",
    multValue: () => DilationUpgrade.ipMultDT.effectOrDefault(1),
    isActive: () => DilationUpgrade.ipMultDT.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => Pelle.specialGlyphEffect.infinity.times(Pelle.isDoomed ? DC.D1 : getAdjustedGlyphEffect("infinityIP")),
    powValue: () => (GlyphAlteration.isAdded("infinity") ? getSecondaryGlyphEffect("infinityIP") : DC.D1),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  alchemy: {
    name: "Glyph Alchemy",
    multValue: () => Replicanti.amount.powEffectOf(AlchemyResource.exponential),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  pelle: {
    name: "Pelle Strike - Vacuum Rift",
    multValue: () => DC.D1.timesEffectsOf(PelleRifts.vacuum),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => ShopPurchase.IPPurchases.currentMult,
    isActive: () => player.IAP.STDcoins.gt(0),
    icon: MultiplierTabIcons.IAP,
  },

  nerfTeresa: {
    name: "Teresa's Reality",
    powValue: () => Decimal.mul(GlitchSpeedUpgrades.all[0].effectOrDefault(1), 0.55),
    isActive: () => Teresa.isRunning,
    icon: MultiplierTabIcons.GENERIC_TERESA,
  },
  nerfV: {
    name: "V's Reality",
    powValue: () => Decimal.mul(GlitchSpeedUpgrades.all[0].effectOrDefault(1), 0.5),
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
  glitchChallengePI: {
    name: "Glitch Challenge (PI)",
    multValue: () => DC.D1.timesEffectsOf(
      preInfinityUG(6),
      preInfinityUG(7),
    ),
    isActive: () => [6,7].some(x => preInfinityUG(x).isBought),
    icon: MultiplierTabIcons.GLITCH_CHALLENGE,
  },
  glitchChallengeBI: {
    name: "Glitch Challenge (BI)",
    multValue: () => DC.D1.timesEffectsOf(
      breakInfinityUG(0),
      breakInfinityUG(1),
      breakInfinityUG(2),
      breakInfinityUG(3),
    ),
    isActive: () => [0,1,2,3].some(x => breakInfinityUG(x).isBought),
    icon: MultiplierTabIcons.GLITCH_CHALLENGE,
  },
  glitchChallengeEternity: {
    name: "Glitch Challenge (Eternity)",
    multValue: () => DC.D1.timesEffectsOf(
      eternityUG(0),
    ),
    isActive: () => eternityUG(0).isBought,
    icon: MultiplierTabIcons.GLITCH_CHALLENGE,
  },
};
