export const metaMilestones = {
    metaProgress: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `Glitch Challenges can be completed at any time, you also gain a ${
            format(Decimal.mul(1.15, MetaMilestone.metaBoost.isReached ? MetaMilestone.metaBoost.effectOrDefault(1) : 1), 2, 2)
            } power to IP,EP,RM, Ra memory gain and Replicanti interval,
             you also gain additional Meta Relays equal to your meta count`,
        effect: () => Decimal.mul(1.15, MetaMilestone.metaBoost.isReached ? MetaMilestone.metaBoost.effectOrDefault(1) : 1),
        condition: () => Currency.metas.gte(1),
        req: "1 Meta"
    },
    realityStart: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `You start Metas with ${format(1e6)} Realities and Reality upgrades don't have their requirements reset`,
        effect: () => 1e6,
        condition: () => Currency.metas.gte(2),
        req: "2 Metas"
    },
    metaBoost: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `Boost Meta milestone 1 based on Metas and Imaginary upgrades don't have thier requirements reset`,
        effect: () => Currency.metas.value.div(15).add(1),
        condition: () => Currency.metas.gte(3),
        req: "3 Metas"
    },
    glyphKeep: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `You keep Glyphs but their level is reset, Glitch Challenges and Achievements don't reset on Meta, Infinity is always Broken`,
        effect: () => 1,
        condition: () => Currency.metas.gte(4),
        req: "4 Metas"
    },
    metaSpeed: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `You gain ${formatX(MetaMilestone.metaSpeed.effectValue)} more MR based on your fastest Meta`,
        effect: () => Decimal.clampMin( Decimal.div(200, Time.bestMetaRealTime.totalMinutes), 1),
        condition: () => Time.bestMetaRealTime.totalHours.lte(new Decimal(1)),
        req: "BestMeta < 1h"
    },
    metaKeepEff: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `You keep Effarig complete and blackholes are permanent on Metas`,
        effect: () => 1,
        condition: () => Time.bestMetaRealTime.totalMinutes.lte(new Decimal(30)),
        req: "BestMeta < 30m"
    },
    metaRaAndLai: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `Keep Ra's glitch memory and lai'tela autobuyers`,
        effect: () => 10,
        condition: () => Time.bestMetaRealTime.totalMinutes.lte(new Decimal(15)),
        req: "BestMeta < 15m"
    },
    metaRealityAndGlitchGlyphAuto: {
        event: GAME_EVENT.META_RESET_AFTER,
        reward: () => `Reality and Glitch Glyphs auto update to the Alchemy cap on Reality`,
        effect: () => 1,
        condition: () => Time.bestMetaRealTime.totalMinutes.lte(new Decimal(5)),
        req: "BestMeta < 5m"
    },
};
