import { DC } from "../constants";
// NOTE: IF ANY COSTS ARE CHANGED HERE, THEY ALSO NEED TO BE CHANGED ON THE BACKEND TOO
export const shopPurchases = {
  dimPurchases: {
    key: "dimPurchases",
    cost: 15,
    description: "Double all your Antimatter Dimension multipliers. Forever.",
    multiplier: purchases => Decimal.pow(2, purchases),
    formatEffect: x => `×${x.gt(1000) ? Notation.scientific.formatDecimal(new Decimal(x), 2) : x.toFixed(0)}`,
  },
  allDimPurchases: {
    key: "allDimPurchases",
    cost: 30,
    description: () => {
      const dims = ["Antimatter"];
      if (InfinityDimension(1).isUnlocked || PlayerProgress.eternityUnlocked()) dims.push("Infinity");
      if (PlayerProgress.eternityUnlocked()) dims.push("Time");
      return `Double ALL Dimension multipliers (${makeEnumeration(dims)}; multiplicative until 32x). Forever.`;
    },
    multiplier: purchases => (purchases.gt(4) ? Decimal.add(32,purchases.sub(5).mul(2)) : Decimal.pow(2, purchases)),
    formatEffect: x => `×${x.toFixed(0)}`,
  },
  IPPurchases: {
    key: "IPPurchases",
    cost: 20,
    description: "Double your Infinity Point gain from all sources. (additive)",
    multiplier: purchases => (purchases.eq(0) ? DC.D1 : purchases.mul(2)),
    formatEffect: x => `×${x.toFixed(0)}`,
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
    lockText: "Infinity",
  },
  replicantiPurchases: {
    key: "replicantiPurchases",
    cost: 30,
    description: "Increase your Replicanti gain by 50%. (additive)",
    multiplier: purchases => (purchases.eq(0) ? DC.D1 : purchases.mul(0.5).add(1)),
    formatEffect: x => `×${x.toFixed(1)}`,
    isUnlocked: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked(),
    lockText: "Replicanti",
  },
  EPPurchases: {
    key: "EPPurchases",
    cost: 25,
    description: "Triple your Eternity Point gain from all sources. (additive)",
    multiplier: purchases => (purchases.eq(0) ? DC.D1 : purchases.mul(3)),
    formatEffect: x => `×${x.toFixed(0)}`,
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
    lockText: "Eternity",
  },
  dilatedTimePurchases: {
    key: "dilatedTimePurchases",
    cost: 20,
    description: "Increase your Dilated Time gain by 50%. (additive)",
    multiplier: purchases => (purchases.eq(0) ? DC.D1 : purchases.mul(0.5).add(1)),
    formatEffect: x => `×${x.toFixed(1)}`,
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
    lockText: "Dilation",
  },
  RMPurchases: {
    key: "RMPurchases",
    cost: 30,
    description: "Increase your Reality Machine gain by 100%. (additive)",
    multiplier: purchases => purchases.add(1),
    formatEffect: x => `×${x.toFixed(0)}`,
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
  smallTimeSkip: {
    key: "smallTimeSkip",
    cost: 10,
    description: "Get 6 hours worth of offline production. (Autobuyers don't work at full speed)",
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseTimeSkip();
    }
  },
  bigTimeSkip: {
    key: "bigTimeSkip",
    cost: 20,
    description: "Get 24 hours worth of offline production. (Autobuyers don't work at full speed)",
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseLongerTimeSkip();
    }
  },
  singleCosmeticSet: {
    key: "singleCosmeticSet",
    cost: 1,
    description: "Unlock a Glyph cosmetic set of your choice",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      GameUI.notify.info(
        `You have purchased the "${GlyphAppearanceHandler.chosenFromModal.name}" Set for Glyph cosmetics!`,
        10000);
      GlyphAppearanceHandler.chosenFromModal = null;
      GlyphAppearanceHandler.applyNotification();
    },
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
  allCosmeticSets: {
    key: "allCosmeticSets",
    cost: () => {
      // Both of these are also on the payment backend, which would need to be changed as well
      const baseCost = 21;
      const totalSets = Object.keys(GameDatabase.reality.glyphCosmeticSets).length;

      // Using this instead of the actual set count maintains consistency with the backend price,
      // at the cost of the frontend UI being wrong for cheated saves
      const currentSetCount = GlyphAppearanceHandler.expectedSetCount;
      return Math.floor(baseCost * (totalSets - currentSetCount) / totalSets);
    },
    description: "Unlock all remaining Glyph cosmetic sets at once",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      GameUI.notify.info(`You have unlocked all sets for Glyph cosmetics!`, 15000);
      GlyphAppearanceHandler.applyNotification();
    },
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
  glitchChall: {
    key: "glitchChall",
    cost: () => {
      if(eternityUGs.allBought) return 50;
      if(breakInfinityUGs.allBought) return 20;
      if(preInfinityUGs.allBought) return 10;
      return 5;
    },
    description: "Unlock the earliest Glitch Challenge",
    instantPurchase: true,
    onPurchase: () => {
      let unlocked = false;
      preInfinityUGs.all.forEach(x => {

        if(!x.isBought && !unlocked) {
          player.glitch.preinfinity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      breakInfinityUGs.all.forEach(x => {

        if(!player.break) return;

        if(!x.isBought && !unlocked) {
          player.glitch.breakinfinity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      eternityUGs.all.forEach(x => {

        if(player.eternities.eq(0)) return;

        if(!x.isBought && !unlocked) {
          player.glitch.eternity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        }

      });

      realityUGs.all.forEach(x => {

        if(player.realities === 0) return;

        if(!x.isBought && !unlocked) {
          player.glitch.reality.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      if(!unlocked){
        GameUI.notify.error("could not unlock anything (STDs are returned)");
        if(realityUGs.allBought) player.IAP.STDcoins = player.IAP.STDcoins.add(50);
        if(eternityUGs.allBought) player.IAP.STDcoins = player.IAP.STDcoins.add(20);
        if(breakInfinityUGs.allBought) player.IAP.STDcoins = player.IAP.STDcoins.add(10);
        if(preInfinityUGs.allBought) player.IAP.STDcoins = player.IAP.STDcoins.add(5);
      }
    }
  },
};
