import { DC } from "../../constants";

export const glitchSpeedUpgrades = [
  {
    name: "The power is growing",
    id: 1,
    cost: new Decimal("1e400"),
    requirement: "Reality with all 9 effects active",
    hasFailed: () => !(Glitch.activeAugments.length < 9),
    checkRequirement: () => Glitch.isRunning && Glitch.activeAugments.length >= 9,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Some Celestial Reality's effect that nerf Prestige gain are weakened by 25%",
    effect: () =>  1.25,
    formatEffect: value => formatX(1.25, 2, 2)
  },
  {
    name: "The cycle continues",
    id: 2,
    cost: new Decimal("1e400"),
    requirement: () => `Have ${format("1e1.25E11")} Antimatter with first 9 effects`,
    hasFailed: () => !(Glitch.activeAugments.length < 9),
    checkRequirement: () => Glitch.isRunning && Glitch.activeAugments.length >= 9 && Currency.antimatter.gte("1e1.25E11"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Ra's static tickspeed is raised by 1.1 per AG past ${format(1e4)}, RG is 1.03 per past ${format(1e4)}, TG is 1.005 per past ${format(1e4)}`,
    effect: () =>  Decimal.pow(1.1, player.galaxies.sub(1e4).max(0)).mul( Decimal.pow(1.03, Replicanti.galaxies.total.sub(1e4).max(0))).mul( Decimal.pow(1.005, player.dilation.totalTachyonGalaxies.sub(1e4).max(0))).max(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Around and around",
    id: 3,
    cost: new Decimal("1e400"),
    requirement: () => `Have less than ${format("1e1E9")} Antimatter after 5 seconds in this Infinity with all 10 effects and Continuum active`,
    hasFailed: () => !(Glitch.augmentEffectBits == 1023) || !Laitela.continuumActive,
    checkRequirement: () => Glitch.isRunning && Glitch.augmentEffectBits == 1023 && Time.thisInfinityRealTime.totalSeconds.gte(5) && Laitela.continuumActive && Currency.antimatter.lt("1e1E9"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "The Rift Force formula is changed to log10(value) ^ 0.2, also you can charge one Infinity Upgrade in Glitch's Reality",
    effect: () =>  1,
    formatEffect: value => "active"
  },
  {
    name: "Unlimited Dimensions",
    id: 4,
    cost: new Decimal("1e600"),
    requirement: () => `Reach ${format("1e60000")} Eternity Points with a negative Blackhole of ${format("1e1E10")} with the first 9 effects`,
    hasFailed: () => !(Glitch.augmentEffectBits == 511),
    checkRequirement: () => Glitch.isRunning && Glitch.augmentEffectBits == 511 && player.requirementChecks.reality.slowestBH.gte('1e10000000000') && Currency.eternityPoints.gte("1e60000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock Chaos Dimensions",
    effect: () =>  1.25,
    formatEffect: value => GlitchSpeedUpgrade(4).isBought ? "Unlocked" : "Locked"
  },
];
