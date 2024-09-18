<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import GlyphSetPreview from "@/components/GlyphSetPreview";
import PrimaryButton from "@/components/PrimaryButton";
import { V_REDUCTION_MODE } from "@/core/secret-formula";
import VUnlockRequirement from "./VUnlockRequirement";

export default {
  name: "VTab",
  components: {
    CelestialQuoteHistory,
    VUnlockRequirement,
    PrimaryButton,
    GlyphSetPreview
  },
  data() {
    return {
      mainUnlock: false,
      canUnlockCelestial: false,
      totalUnlocks: 0,
      pp: 0,
      showReduction: false,
      runRecords: [],
      runGlyphs: [],
      isHard: false,
      isExtreme: false,
      hasHardUnlocked: true,
      hasExtremeUnlocked: true,
      isRunning: false,
      isRunningExtreme: false,
      hasAlchemy: false,
    };
  },
  computed: {
    mainUnlockDB: () => GameDatabase.celestials.v.mainUnlock,
    celestialUnlockClassObject() {
      return {
        "o-v-milestone": true,
        "o-v-milestone--unlocked": this.canUnlockCelestial,
        "c-v-unlock-button--enabled": this.canUnlockCelestial
      };
    },
    // If V is flipped, change the layout of the grid
    hexGrid() {
      if(this.isExtreme && this.hasExtremeUnlocked) return [
        VRunUnlocks.all[10],
        VRunUnlocks.all[11],
        {},
        VRunUnlocks.all[12],
        { isRunButtonExtreme: true },
        {},
        {},
        {},
        {}];

      return this.isHard && this.hasHardUnlocked
        ? [
          VRunUnlocks.all[6],
          VRunUnlocks.all[7],
          {},
          {},
          { isRunButton: true },
          VRunUnlocks.all[8],
          {},
          VRunUnlocks.all[9],
          {}
        ]
        : [
          VRunUnlocks.all[0],
          VRunUnlocks.all[1],
          {},
          VRunUnlocks.all[5],
          { isRunButton: true },
          VRunUnlocks.all[2],
          VRunUnlocks.all[4],
          VRunUnlocks.all[3],
          {}
        ];
    },
    vUnlock: () => VUnlocks.vAchievementUnlock,
    runMilestones() {
      let list = [
        [
          VUnlocks.shardReduction,
          VUnlocks.adPow,
          VUnlocks.fastAutoEC
        ],
        [
          VUnlocks.autoAutoClean,
          VUnlocks.achievementBH,
          VUnlocks.raUnlock
        ],
      ];
      if(this.hasExtremeUnlocked) list.push([VUnlocks.gamespeedPower, VUnlocks.RMcap]);
      return list;
    },
    runButtonClassObject() {
      return {
        "l-v-hexagon": true,
        "c-v-run-button": true,
        "c-v-run-button--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runExtremeButtonClassObject() {
      return {
        "l-v-hexagon": true,
        "c-v-run-button-extreme": this.isExtreme,
        "c-v-run-button--running-extreme": this.isRunningExtreme,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      if(this.isExtreme) return GameDatabase.celestials.descriptions[3].extremeEffectsShort().replace(/^\w/u, c => c.toUpperCase());
      return GameDatabase.celestials.descriptions[3].effects().replace(/^\w/u, c => c.toUpperCase());
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.mainUnlock = VUnlocks.vAchievementUnlock.isUnlocked;
      this.canUnlockCelestial = V.canUnlockCelestial;
      this.totalUnlocks = V.spaceTheorems;
      this.pp = Currency.perkPoints.value;
      this.showReduction = VUnlocks.shardReduction.isUnlocked;
      this.runRecords = Array.from(player.celestials.v.runRecords);
      this.runGlyphs = player.celestials.v.runGlyphs.map(gList => Glyphs.copyForRecords(gList));
      this.isHard = player.celestials.v.wantsHard;
      this.isExtreme = player.celestials.v.wantsExtreme;
      this.hasHardUnlocked = V.isHard;
      this.hasExtremeUnlocked = V.isExtreme;
      this.isRunning = V.isRunning;
      this.isRunningExtreme = V.isRunningExtreme;
      this.hasAlchemy = Ra.unlocks.unlockGlyphAlchemy.canBeApplied;
    },
    sName(){
      if(player.options.themeModern == "S14") return "Ra-V's";
      return "V's";
    },
    sCel(){
      if(player.options.themeModern == "S14") return "Ra-V";
      return "V";
    },
    unlockCelestial() {
      if (V.canUnlockCelestial) V.unlockCelestial();
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: this.sName(), number: 3 });
    },
    startExtremeRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: this.sName(), number: 3, isHarder: true });
    },
    has(info) {
      return info.isUnlocked;
    },
    mode(hex) {
      if(hex.config.mode === V_REDUCTION_MODE.POWER) return "powered 1/x"
      return hex.config.mode === V_REDUCTION_MODE.SUBTRACTION ? "reduced" : "divided";
    },
    reductionValue(hex) {
      if(hex.config.mode === V_REDUCTION_MODE.POWER) return format(Decimal.pow10(10 ** hex.reduction))
      return hex.config.mode === V_REDUCTION_MODE.SUBTRACTION
        ? format(hex.reduction)
        : format(Decimal.pow10(hex.reduction));
    },
    showRecord(hex) {
      return this.runRecords[hex.id] > 0 || hex.completions > 0;
    },
    reduceGoals(hex) {
      if (!Currency.perkPoints.purchase(hex.reductionCost)) return;
      const steps = hex.config.reductionStepSize ? hex.config.reductionStepSize : 1;
      player.celestials.v.goalReductionSteps[hex.id] += steps;
      for (const unlock of VRunUnlocks.all) {
        unlock.tryComplete();
      }
      V.checkForUnlocks();
    },
    reductionTooltip(hex) {
      return `Spend ${quantify("Perk Point", hex.reductionCost, 2, 0)}
        to reduce goal by ${format(hex.config.perReductionStep)}`;
    },
    hexColor(hex) {
      const completions = hex.completions / hex.config.values.length;
      if (completions === 1) return "var(--color-v--base)";
      const r = 255 - (30 * completions);
      const g = 255 - (60 * completions);
      const b = 255 - (120 * completions);
      return `rgb(${r},${g},${b})`;
    },
    toggleHard() {
      player.celestials.v.wantsExtreme = false;
      player.celestials.v.wantsHard = !this.isHard;
    },
    toggleExtreme() {
      player.celestials.v.wantsHard = false;
      player.celestials.v.wantsExtreme = !this.isExtreme;
    },
    unworthy() {
      for (let i = 10; i < VRunUnlocks.all.length; i++) {
        VRunUnlocks.all[i].reset();
      }
      V.updateTotalRunUnlocks();
    },
    createCursedGlyph() {
      Glyphs.giveCursedGlyph();
    }
  }
};
</script>

<template>
  <div class="l-v-celestial-tab">
    <CelestialQuoteHistory celestial="v" />
    <div
      v-if="!mainUnlock"
      class="c-v-info-text"
    >
      <v-unlock-requirement
        v-for="req in mainUnlockDB"
        :key="req.name"
        :db-entry="req"
      />
      <div class="l-v-milestones-grid__row">
        <div
          :class="celestialUnlockClassObject"
          @click="unlockCelestial"
        >
          <p>{{ vUnlock.description }}</p>
          <p>{{ vUnlock.rewardText }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-if="hasHardUnlocked"
        class="c-v-info-text"
      >
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="toggleHard"
        >
          <span v-if="isHard">Hide</span>
          <span v-else>Show</span>
          Hard {{ sCel() }}
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="toggleExtreme"
          v-if="hasExtremeUnlocked"
        >
          <span v-if="isExtreme">Hide</span>
          <span v-else>Show</span>
          Extreme {{ sCel() }}
        </PrimaryButton>

        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="unworthy"
          v-if="hasExtremeUnlocked"
        >
          Reset Extreme {{ sCel() }}-Achievements
        </PrimaryButton>

        <PrimaryButton
          class="o-primary-btn--subtab-option l-cursed-glyph-creation"
          @click="createCursedGlyph"
        >
          Create a Cursed Glyph
        </PrimaryButton>
        <br>
        Cursed Glyphs can be created here or in the Effarig tab.
        <br>
        Cursed Glyphs count as {{ formatInt(-3) }} Glyphs for the purposes of all requirements related to Glyph count.
        <br>
        <span v-if="!isDoomed">The Black Hole can now be used to slow down time if they are both permanent.</span>
        <br><br>
        Each Hard {{ sCel() }}-Achievement counts as two {{ sCel() }}-Achievements and will award {{ formatInt(2) }} Space Theorems
        instead of {{ formatInt(1) }}.
        <br>
        Goal reduction is significantly more expensive for Hard {{ sCel() }}-Achievements.

        <div
        v-if="hasExtremeUnlocked"
        class="c-v-info-text"
        >
          <br>
          Each Extreme {{ sCel() }}-Achievement counts as five {{ sCel() }}-Achievements.
          <br>
          Goal reduction is significantly more expensive for Extreme {{ sCel() }}-Achievements.
        </div>

      </div>
      <div
        v-if="showReduction"
        class="c-v-info-text"
      >
        You have {{ quantify("Perk Point", pp, 2, 0) }}.
      </div>
      <div class="l-v-unlocks-container">
        <li
          v-for="(hex, hexId) in hexGrid"
          :key="hexId + '-v-hex'"
          :style="[(hex.isRunButton || hex.isRunButtonExtreme) ? {zIndex: 1} : {zIndex: 0}]"
        >
          <div
            v-if="hex.config"
            class="l-v-hexagon c-v-unlock"
            :style="'background-color: ' + hexColor(hex)"
          >
            <p class="o-v-unlock-name">
              <br v-if="hex.canBeReduced && showReduction">{{ hex.config.name }}
            </p>
            <p
              class="o-v-unlock-desc"
              v-html="hex.formattedDescription"
            />
            <p
              v-if="has(runMilestones[0][0]) && hex.isReduced"
              class="o-v-unlock-goal-reduction"
            >
              Goal has been {{ mode(hex) }} by {{ reductionValue(hex) }}
            </p>
            <p class="o-v-unlock-amount">
              {{ formatInt(hex.completions) }}/{{ formatInt(hex.config.values.length) }} done
            </p>
            <div v-if="showRecord(hex)">
              <p class="o-v-unlock-record">
                Best: {{ hex.config.formatRecord(runRecords[hex.id]) }}
              </p>
              <p>
                <GlyphSetPreview
                  :glyphs="runGlyphs[hex.id]"
                  :text="hex.config.name"
                  :text-hidden="true"
                />
              </p>
              <div v-if="hex.canBeReduced && showReduction">
                <div class="l-v-goal-reduction-spacer" />
                <button
                  class="o-primary-btn l-v-reduction"
                  :class="{ 'o-primary-btn--disabled': !hex.canBeReduced || pp < hex.reductionCost }"
                  :ach-tooltip="reductionTooltip(hex)"
                  @click="reduceGoals(hex)"
                >
                  <i class="fas fa-angle-double-down" />
                </button>
              </div>
            </div>
          </div>
          <div
            v-else-if="hex.isRunButton"
            :class="runButtonClassObject"
            @click="startRun()"
          >
            <b
              class="o-v-start-text"
              :class="{ 'o-pelle-disabled': isDoomed }"
            >
              <span v-if="isRunning">You are in </span>
              <span v-else>Start </span>
              {{ sName() }} Reality.
            </b>
            <br>
            <div :style="{ 'font-size': hasAlchemy ? '1.2rem' : '' }">
              {{ runDescription }}
            </div>
            <div class="c-v-run-button__line c-v-run-button__line--1"/>
            <div class="c-v-run-button__line c-v-run-button__line--2"/>
            <div class="c-v-run-button__line c-v-run-button__line--3"/>
          </div>
          <div
            v-else-if="hex.isRunButtonExtreme"
            :class="runExtremeButtonClassObject"
            @click="startExtremeRun()"
          >
            <b
              class="o-v-start-text"
              :class="{ 'o-pelle-disabled': isDoomed }"
            >
              <span v-if="isRunningExtreme">You are in </span>
              <span v-else>Start </span>
              {{ sName() }} Extreme Reality.
            </b>
            <br>
            <div :style="{ 'font-size': hasAlchemy ? '1.2rem' : '' }">
              {{ runDescription }}
            </div>
            <div class="c-v-run-button__line-extreme c-v-run-button__line--1" />
            <div class="c-v-run-button__line-extreme c-v-run-button__line--2" />
            <div class="c-v-run-button__line-extreme c-v-run-button__line--3" />
          </div>
          <div v-else>
            <div class="l-v-hexagon l-placeholder-invisible" />
          </div>
        </li>
      </div>
      <div class="c-v-info-text">
        {{ sCel() }}-Achievements can only be completed within {{ sName() }} Reality, but are permanent and do not reset upon leaving
        and re-entering the Reality.
      </div>
      <div class="c-v-info-text">
        You have {{ formatInt(totalUnlocks) }} {{ sCel() }}-Achievements done.
        <span v-if="!isDoomed">
          You gain {{ formatInt(1) }} Space Theorem for each completion,
          allowing you to purchase Time Studies which are normally locked.
          <br>
          Space Theorems can also be used as a Currency in the Automator.
        </span>
      </div>
      <br>
      <div class="l-v-milestones-grid">
        <div
          v-for="(row, rowId) in runMilestones"
          :key="rowId + '-v-ms-row'"
          class="l-v-milestones-grid__row"
        >
          <div
            v-for="(milestone, colId) in row"
            :key="colId + rowId*10 + '-v-ms'"
            class="o-v-milestone"
            :class="{'o-v-milestone--unlocked':
              has(milestone)}"
          >
            <div :class="{ 'o-pelle-disabled': isDoomed }">
              <p>{{ milestone.description }}</p>
              <p>Reward: {{ milestone.rewardText }}</p>
              <p v-if="milestone.formattedEffect">
                Currently: <b>{{ milestone.formattedEffect }}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-v-start-text {
  font-size: 1.5rem;
}

.l-placeholder-invisible {
  opacity: 0;
}

.l-v-goal-reduction-spacer {
  height: 0.8rem;
}

.l-cursed-glyph-creation {
  background: var(--color-effarig--base);
}
</style>
