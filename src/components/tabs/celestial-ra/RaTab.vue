<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import RaPet from "./RaPet";
import RaPetRemembranceButton from "./RaPetRemembranceButton";

export default {
  name: "RaTab",
  components: {
    RaPet,
    RaPetRemembranceButton,
    CelestialQuoteHistory
  },
  data() {
    return {
      memoriesPerChunk: new Decimal(),
      showReality: false,
      isRaCapped: false,
      totalLevels: 0,
      hasRemembrance: false,
      remembranceReq: 0,
      remembranceMult: 1,
      remembranceNerf: 1,
      petWithRemembrance: "",
      isRunning: false,
      memoryBoosts: "",
      meta25: false,
    };
  },
  computed: {
    laitelaUnlock: () => Laitela.isUnlocked,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeVisible: () => Ra.unlocks.chargedInfinityUpgrades.isUnlocked,
        scalingUpgradeText: () => `You can Charge ${quantifyInt("Infinity Upgrade", Ra.totalCharges)}.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${quantifyInt("Alchemy Resource", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeVisible: () => Ra.unlocks.improvedStoredTime.isUnlocked,
        scalingUpgradeText: () => `Stored game time
          ${formatX(Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1), 2)} and real time
          +${formatInt(Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0) / (1000 * 3600))} hours`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Ra.unlocks.unlockHardV.isUnlocked,
        scalingUpgradeText: () => {
          const triadCount = Ra.unlocks.unlockHardV.effectOrDefault(0);
          return `You have unlocked ${quantifyInt("Triad Study", triadCount)}.`;
        },
      },
      {
        pet: Ra.pets.glitchyfishys,
        scalingUpgradeVisible: () => Ra.unlocks.memroygain1.isUnlocked,
        scalingUpgradeText: () => {
          const  memory = Ra.unlocks.glitchyfishysXP.effectOrDefault(1);
          return `x${format(memory,2,2)} memory gain.`;
        },
      },
      {
        pet: Ra.pets.cante,
        scalingUpgradeVisible: () => Ra.unlocks.repMul.isUnlocked,
        scalingUpgradeText: () => {
          const  memory = Ra.unlocks.repMul.effectOrDefault(1);
          return `${format(memory,2,2)} Replicanti Power.`;
        },
      },
      {
        pet: Ra.pets.null,
        scalingUpgradeVisible: () => Ra.unlocks.nullInfCap.isUnlocked,
        scalingUpgradeText: () => {
          const  memory = Ra.unlocks.nullXP.effectOrDefault(1);
          return `x${format(memory,2,2)} Infinity Dimensions cap.`;
        },
      },
    ],
    petStyle() {
      return {
        color: (this.petWithRemembrance === "")
          ? "white"
          : this.pets.find(pet => pet.pet.name === this.petWithRemembrance).pet.color,
      };
    },
    runButtonClassObject() {
      return {
        "c-ra-run-button__icon": true,
        "c-ra-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[4].effects().replace(/^\w/u, c => c.toUpperCase()).split("\n");
    },
    memoryDescription() {
      let n = "Ra's";
      if(player.options.themeModern == "S15") n = "Teresa-Ra's";
      if(player.options.themeModern == "S16") return "Effarig-Ra's";
      if(player.options.themeModern == "S13") n = "V-Ra's";
      if(player.options.themeModern == "S18") return `Lai'tela-Ra's`;
      if(player.options.themeModern == "S19") return `Pelle-Ra's`;
      return `Within ${n} Reality, Memory Chunks for Celestial Memories
        will be generated based on certain resource amounts.`;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.memoriesPerChunk.copyFrom(Ra.productionPerMemoryChunk);
      this.memoriesPerCandNChunk = Ra.CandNChunkProduction;
      this.isRaCapped = Ra.totalPetLevel === Ra.maxTotalPetLevel;
      this.totalLevels = Ra.totalPetLevel;
      this.hasRemembrance = Ra.remembrance.isUnlocked;
      this.remembranceReq = Ra.remembrance.requiredLevels;
      this.remembranceMult = Ra.remembrance.multiplier;
      this.remembranceNerf = Ra.remembrance.nerf;
      this.petWithRemembrance = Ra.petWithRemembrance;
      this.isRunning = Ra.isRunning;
      this.memoryBoosts = Ra.memoryBoostResources;
      this.meta25 = MetaFabricatorUpgrade(25).isBought;
    },
    sName(){
      if(player.options.themeModern == "S15") return "Teresa-Ra's";
      if(player.options.themeModern == "S16") return "Effarig-Ra's";
      if(player.options.themeModern == "S17") return `The Nameless Ra's`;
      if(player.options.themeModern == "S18") return `Lai'tela-Ra's`;
      if(player.options.themeModern == "S19") return `Pelle-Ra's`;
      if(player.options.themeModern == "S13") return "V-Ra's";
      return "Ra's";
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Ra's", number: 4 });
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
};
</script>

<template>
  <div class="l-ra-celestial-tab">
    <div class="c-ra-memory-header">
      <CelestialQuoteHistory celestial="ra" />
      <div v-if="!isRaCapped">
        Each Memory Chunk generates a base of one Memory per second<span v-if="memoriesPerChunk.gt(1)">,
          which has been increased to {{ quantify("Memory", memoriesPerChunk, 2, 3) }} per second</span>.
          <span v-if="meta25"><br>Which has been increased to {{ quantify("Memory", memoriesPerCandNChunk, 2, 3) }} per second for Cante and Null</span>.
        <br>
        Storing real time prevents Memory Chunk generation, but Memories will still be gained normally.
        <span v-if="memoriesPerChunk.gt(1)">
          <br>
          This is being increased due to {{ memoryBoosts }}.
        </span>
      </div>
      <div v-else>
        All Memories have been returned.
      </div>
    </div>
    <div>
      Mouse-over the icons below the bar to see descriptions of upgrades,
      <br>
      and mouse-over <i class="fas fa-question-circle" /> icons for specific resource information.
    </div>
    <div class="l-ra-all-pets-container">
      <RaPet
        v-for="(pet, i) in pets"
        :key="i"
        :pet-config="pet"
      />
    </div>
    <div class="l-ra-non-pets">
      <button class="c-ra-run-button">
        <h2 :class="{ 'o-pelle-disabled': isDoomed }">
          <span v-if="isRunning">You are in </span>
          <span v-else>Start </span>
          {{sName()}} Reality
        </h2>
        <div
          :class="runButtonClassObject"
          @click="startRun"
        >
          <span class="c-ra-run-button__icon__sigil fas fa-sun" />
        </div>
        <span
          v-for="(line, lineId) in runDescription"
          :key="lineId + '-ra-run-desc'"
        >
          {{ line }}
        </span>
        <br>
        <span>
          {{ memoryDescription }}
        </span>
      </button>
      <div
        v-if="!isRaCapped"
        class="c-ra-remembrance-unlock"
      >
        <h1 :style="petStyle">
          Remembrance
        </h1>
        <span :style="petStyle">
          Whichever Celestial has Remembrance will get {{ formatX(remembranceMult) }} Memory Chunk gain. The other
          Celestials will get {{ formatX(remembranceNerf, 1, 1) }} Memory Chunk gain.
        </span>
        <div
          v-if="hasRemembrance"
          class="c-ra-remembrance-unlock-inner"
        >
          <RaPetRemembranceButton
            v-for="(pet, i) in pets"
            :key="i"
            :pet-config="pet"
          />
        </div>
        <div
          v-else
          class="c-ra-remembrance-unlock-inner"
        >
          Unlocked by getting {{ formatInt(remembranceReq) }} total Celestial Memory levels
          (you need {{ formatInt(remembranceReq - totalLevels) }} more)
        </div>
      </div>
    </div>
  </div>
</template>
