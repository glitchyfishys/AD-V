import { Currency } from "../../currency";
import wordShift from "@/core/word-shift";

export const cante = {
  repUnlocks:[
    {
        unlock: () => `Have ${format(1e20)} Metas`,
        condition: () => Currency.metas.gt(1e20),
    },
    {
        unlock: () => `Have ${format(1e10)} Artificial Matter`,
        condition: () => Currency.artificialMatter.gt(1e10),
    },
    {
        unlock: () => `Have ${format(1e50)} Meta Relays`,
        condition: () => Currency.metaRelays.gte(1e50),
    },
    {
        unlock: () => `Have ${format(1e100)} Artificial Matter and ${format(1e75)} Meta Relays`,
        condition: () => Currency.artificialMatter.gt(1e100) && Currency.metaRelays.gte(1e75),
    },
    {
        unlock: () => `Unlocked Via upgrade`,
        condition: () => CanteUpgrades.all[7].canBeApplied,
    },
    {
        unlock: () => `Have ${format(10)} Chaotic Matter`,
        condition: () => Currency.chaosMatter.gte(10),
    },
    {
        unlock: () => `Have ${format(1000)} Chaotic Matter`,
        condition: () => Currency.chaosMatter.gte(1000),
    },
    {
        unlock: () => `Have ${format('e3500')} Meta Relays`,
        condition: () => Currency.metaRelays.gte('e3500'),
    },
    {
        unlock: () => `Have ${format('e8000')} MR, ${format('ee12')} ArtM and ${format(1e15)} CM`,
        condition: () => Currency.artificialMatter.gt('ee12') && Currency.metaRelays.gte('e8000') && Currency.chaosMatter.gte(1e15),
    },
    {
        unlock: () => `(NYI)`,
        condition: () => false,
    },
  ],
  upgrades: [
    {
        id: 0,
        description: "Lower the cost scaling of Replicators by 40%",
        cost: new Decimal(1e45),
        effect: () => 0.6,
        formatEffect: e => formatX(e, 1, 1)
    },
    {
        id: 1,
        description: "Replicators are slightly effected by ArtM",
        cost: new Decimal(1e75),
        effect: () => Currency.artificialMatter.value.max(10).log10().pow(2),
        formatEffect: e => formatX(e, 2, 2)
    },
    {
        id: 2,
        description: "Each Replicator slightly effects the pervious one",
        cost: new Decimal(1e110),
        noLabel: true,
    },
    {
        id: 3,
        description: "Peak Gamespeed partly affects Replicators and divide cost scaling by 2",
        cost: new Decimal(1e130),
        effect: () => player.celestials.ra.peakGamespeed.max(10).log10().pow(3.75),
        formatEffect: e => formatX(e, 2, 2),
    },
    {
        id: 4,
        description: "Delay cost scaling based on ArtM",
        cost: new Decimal(1e200),
        effect: () => Currency.artificialMatter.value.pow(0.24).max(1),
        formatEffect: e => formatX(e, 2, 2),
    },
    {
        id: 5,
        description: "Replicators gain a muliplier based on thier amount",
        cost: new Decimal('e350'),
        noLabel: true,
    },
    {
        id: 6,
        description: "Divide exponential cost scaling by 80",
        cost: new Decimal('e500'),
        effect: () => 80,
        noLabel: true,
    },
    {
        id: 7,
        description: "Unlock the 5th Replicator and Replicators gain a power equal to it's tier ^ 0.5",
        cost: new Decimal('6e666'),
        noLabel: true,
    },
    {
        id: 8,
        description: "Unlock the autobuyers for Replicators",
        cost: new Decimal('se1500'),
        noLabel: true,
    },
    {
        id: 9,
        description: "Replicator softcaps are weaker",
        cost: new Decimal('5'),
        effect: 2,
        noLabel: true,
        chaos: true,
    },
    {
        id: 10,
        description: () => `Replicators are ${format(1e10)} times stronger`,
        cost: new Decimal('15'),
        effect: 1e10,
        noLabel: true,
        chaos: true,
    },
    {
        id: 11,
        description: () => `Gain ${formatPercents(1)} of you Artificial Matter per second`,
        cost: new Decimal('25'),
        effect: 1,
        noLabel: true,
        chaos: true,
    },
    {
        id: 12,
        description: () => `Replicator upgrades are no longer reset`,
        cost: new Decimal('36'),
        effect: 1,
        noLabel: true,
        chaos: true,
    },
    {
        id: 13,
        description: () => `Artificial Matter softcaps are weaker`,
        cost: new Decimal('100'),
        effect: 0.66,
        noLabel: true,
        chaos: true,
    },
    {
        id: 14,
        description: () => `Chaotic Matter boost it's own gain`,
        cost: new Decimal('2500'),
        effect: () => Currency.chaosMatter.value.add(10).log10().pow(2),
        formatEffect: e => formatX(e, 2, 2),
        chaos: true,
    },
    {
        id: 15,
        description: () => `Chaotic Repicators boost CM gain`,
        cost: new Decimal('e7'),
        effect: () => [CanteReplicator(6).amount,CanteReplicator(7).amount,CanteReplicator(8).amount,CanteReplicator(9).amount,CanteReplicator(10).amount]
        .reduce(Decimal.prodReducer).add(2).log2().add(2).pow(1.2).log2().add(1).pow(3).div(250).max(1),
        formatEffect: e => formatX(e, 2, 2),
        chaos: true,
    },
    {
        id: 16,
        description: () => `CM boosts Replicator per purchase more`,
        cost: new Decimal('e10'),
        effect: () => Currency.chaosMatter.value.add(10).log10().pow(3).div(500),
        formatEffect: e => formatPow(e, 2, 2),
        chaos: true,
    },
    {
        id: 17,
        description: () => `Gain ${formatPercents(0.01)} of Chaotic Matter per second`,
        cost: new Decimal('e12'),
        effect: () => CanteReplicators.chaosMatterGain.div(100),
        formatEffect: e => format(e, 2, 2),
        chaos: true,
    },
    {
        id: 18,
        description: () => `CM formula change`,
        cost: new Decimal('e15'),
        effect: () => 2,
        formatEffect: e => 'log10 => log2 ^ 1.05',
        chaos: true,
    },
    {
        id: 19,
        description: () => `Unlock The ${wordShift.wordCycle(['Lost', 'Missing', 'Removed'])}`,
        cost: new Decimal('e18'),
        effect: () => Math.random(),
        onPurchased: () => Cante.quotes.thePast.show(),
        formatEffect: e => wordShift.wordCycle(['Lost', 'Missing', 'Removed']),
        chaos: true,
    },
  ]
};
