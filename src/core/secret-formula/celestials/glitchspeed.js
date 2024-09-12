import { DC } from "../../constants";

export const glitchSpeedUpgrades = [
  {
    name: "The power is growing",
    id: 1,
    cost: new Decimal("1e400"),
    requirement: "Reality with all effects",
    hasFailed: () => !(Glitch.activeAugments.length <= 9),
    checkRequirement: () => Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Some Celestial Reality's effect that neff Presteage gain are weakend by 25%",
    effect: () =>  1.25,
    formatEffect: value => formatX(1.25, 2, 2)
  },
  {
    name: "The cycle continues",
    id: 2,
    cost: new Decimal("1e400"),
    requirement: () => `Have ${format("1e1.25E11")} Antimatter (first 9 effects)`,
    hasFailed: () => !(Glitch.activeAugments.length <= 9),
    checkRequirement: () => Glitch.isRunning && Glitch.activeAugments.length >= 9 && Currency.antimatter.gte("1e1.25E11"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Ra's static tickspeed is rased by 1.1 per AG past ${format(1e4)}, RG is 1.03 per past ${format(1e4)}, TG is 1.005 per past ${format(1e4)}`,
    effect: () =>  Decimal.pow(1.1, (Math.max(player.galaxies - 1e4, 0))).mul( Decimal.pow(1.03, Math.max( Replicanti.galaxies.total - 1e4, 0))).mul( Decimal.pow(1.005, Math.max( player.dilation.totalTachyonGalaxies - 1e4, 0))).max(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Around and around",
    id: 3,
    cost: new Decimal("1e400"),
    requirement: () => `Have less than ${format("1e1E9")} Antimatter after 5 seconds in this Infinity (all 10 effects, Continuum active)`,
    hasFailed: () => !(Glitch.augmentEffectBits == 1023) && !Laitela.continuumActive,
    checkRequirement: () => Glitch.isRunning && Glitch.augmentEffectBits == 1023 && Time.thisInfinityRealTime.totalSeconds.gte(5) && Laitela.continuumActive && Currency.antimatter.lt("1e1E9"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "The Rift Force fomula is changed (log10(value) ** 0.2), also you can charge one Infinity Upgrade in Glitch's Reality",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Unlimited Dimensions",
    id: 4,
    cost: new Decimal("1e600"),
    requirement: () => `Reach ${format(1e60000)} Eternity Points with a negitive Blackhole of ${format("1e1E10")} (first 9 effects)`,
    hasFailed: () => !(Glitch.augmentEffectBits == 511),
    checkRequirement: () => Glitch.isRunning && Glitch.augmentEffectBits == 511 && player.requirementChecks.reality.slowestBH.lte(1e-10) && Currency.eternityPoints.gte("1e60000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock Chaos Dimensions",
    effect: () =>  1.25,
    formatEffect: value => GlitchSpeedUpgrade(4).isBought ? "Unlocked" : "Locked"
  },
];
