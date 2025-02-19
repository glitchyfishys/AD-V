<script>
import { DC } from "@/core/constants";

import { BreakdownEntryInfo } from "./breakdown-entry-info";
import { getResourceEntryInfoGroups } from "./breakdown-entry-info-group";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

// A few props are special-cased because they're base values which can be less than 1, but we don't want to
// show them as nerfs
const nerfBlacklist = ["IP_base", "EP_base", "TP_base"];

export default {
  name: "MultiplierBreakdownEntry",
  components: {
    PrimaryToggleButton
  },
  props: {
    resource: {
      type: BreakdownEntryInfo,
      required: true,
    },
    isRoot: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      selected: 0,
      showGroup: [],
      hadChildEntriesAt: [],
      mouseoverIndex: -1,
      dilationExponent: 1,
      isDilated: false,
      // This is used to temporarily remove the transition function from the bar styling when changing the way
      // multipliers are split up; the animation which results from not doing this looks very awkward
      lastLayoutChange: Date.now(),
      now: Date.now(),
      totalMultiplier: DC.D1,
      totalPositivePower: DC.D1,
      inNC12: false,
    };
  },
  computed: {
    groups() {
      return getResourceEntryInfoGroups(this.resource.key);
    },
    /**
     * @returns {BreakdownEntryInfo[]}
     */
    entries() {
      return this.groups[this.selected].entries;
    },
    containerClass() {
      return {
        "c-multiplier-entry-container": true,
        "c-multiplier-entry-root-container": this.isRoot,
      };
    },
    isEmpty() {
      return this.entries.filter(entry => 
      (Decimal.neq(entry.data.mult, 1) && Decimal.neq(entry.data.mult, 0)) ||
      (Decimal.neq(entry.data.pow, 1) && Decimal.neq(entry.data.pow, 0)) ||
      (Decimal.neq(entry.data.tet, 1) && Decimal.neq(entry.data.tet, 0))).length === 0;
    },
    disabledText() {
      if (!this.resource.isBase) return `Total effect inactive, disabled, or reduced to ${formatX(1)}`;
      return Decimal.eq(this.resource.mult, 0)
        ? `You cannot gain this resource (prestige requirement not reached)`
        : `You have no multipliers for this resource (will gain ${format(1)} on prestige)`;
    },
    // IC4 is the first time the player sees a power-based effect, not counting how infinity power is handled.
    // This doesn't need to be reactive because completing IC4 for the first time forces a tab switch
    hasSeenPowers() {
      return InfinityChallenge(4).isCompleted || PlayerProgress.eternityUnlocked();
    },
    // While infinity power is a power-based effect, we want to disallow showing that as an equivalent multiplier
    // since that it doesn't make a whole lot of sense to do that. We also want to hide this for entries related
    // to tickspeed/galaxies because we already mostly hack those with fake values and should thus not allow those
    // to be changed either.
    allowPowerToggle() {
      const forbiddenEntries = ["AD_infinityPower", "galaxies", "tickspeed"];
      // Uses startsWith instead of String equality since it has to match both the top-level entry and any
      // related children entries further down the tree.
      return !forbiddenEntries.some(key => this.resource.key.startsWith(key));
    },
  },
  created() {
    if (this.groups.length > 1 && player.options.multiplierTab.showAltGroup) {
      this.changeGroup();
    }
  },
  methods: {
    update() {
      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i];
        entry.update();
        const hasChildEntries = getResourceEntryInfoGroups(entry.key)
          .some(group => group.hasVisibleEntries);
        if (hasChildEntries) {
          this.hadChildEntriesAt[i] = Date.now();
        }
      }
      this.dilationExponent = this.resource.dilationEffect;
      this.isDilated = this.dilationExponent.neq(1);
      this.now = Date.now();
      this.inNC12 = NormalChallenge(12).isRunning;
    },
    changeGroup() {
      this.selected = (this.selected + 1) % this.groups.length;
      player.options.multiplierTab.showAltGroup = this.selected === 1;
      this.showGroup = Array.repeat(false, this.entries.length);
      this.hadChildEntriesAt = Array.repeat(0, this.entries.length);
      this.lastLayoutChange = Date.now();
      this.update();
    },
    singleEntryClass(index) {
      return {
        "c-single-entry": true,
        "c-single-entry-highlight": this.mouseoverIndex === index,
      };
    },
    shouldShowEntry(entry) {
      return entry.data.isVisible || this.isRecent(entry.data.lastVisibleAt);
    },
    barSymbol(index) {
      return this.entries[index].icon?.symbol ?? "<i>?</i>";
    },
    barColour(index) {
      const entry = this.entries[index];
      const sty = entry.icon;
      const isNerf = (Decimal.lt(entry.data.mult, 1) && Decimal.neq(entry.data.mult, 0)) ||
      (Decimal.lt(entry.data.pow, 1) && Decimal.neq(entry.data.pow, 0)) ||
      (Decimal.lt(entry.data.tet, 1) && Decimal.neq(entry.data.tet, 0))
      return {
        color: sty?.color ?? "white",
        background: isNerf
          ? `repeating-linear-gradient(-45deg, var(--color-bad), ${sty?.textColor} 0.8rem)`
          : sty?.textColor,
          width: '35px',
          display: 'inline-block',
          textAlign: 'center'

      }
    },
    hasChildEntries(index) {
      return this.isRecent(this.hadChildEntriesAt[index]);
    },
    expandIcon(index) {
      return this.showGroup[index] ? "far fa-minus-square" : "far fa-plus-square";
    },
    expandIconStyle(index) {
      return {
        opacity: this.hasChildEntries(index) ? 1 : 0
      };
    },
    entryString(index) {
      const entry = this.entries[index];

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      if (!entry.data.isVisible) {
        return `${entry.name}: No Effect`;
      }
      
      if ((Decimal.lt(entry.mult ? entry.mult : 1, 1) ||
      Decimal.lt(entry.pow ? entry.pow : 1, 1) ||
      Decimal.lt(entry.tet ? entry.tet : 1, 1)) &&
      !nerfBlacklist.includes(this.entries[index].key)) {
        return this.nerfString(index);
      }

      const overrideStr = entry.displayOverride;
      let valueStr;
      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];
        const formatFn = x => {
          const isDilated = entry.isDilated;
          if (isDilated && this.dilationExponent !== 1) {
            const undilated = this.applyDilationExp(x, 1 / this.dilationExponent);
            return `${formatX(undilated, 2, 2)} ➜ ${formatX(x, 2, 2)}`;
          }
          return entry.isBase
            ? formatSmall(x, 2, 2)
            : `x${formatSmall(x, 2, 2)}`;
        };

        if (Decimal.neq(entry.data.mult, 1) && Decimal.neq(entry.data.mult, 0)) values.push(formatFn(entry.data.mult));
        if (Decimal.neq(entry.data.pow, 1) && Decimal.neq(entry.data.pow, 0)) values.push(formatPow(entry.data.pow, 2, 3));
        if (Decimal.neq(entry.data.tet, 1) && Decimal.neq(entry.data.tet, 0)) values.push(formatTet(entry.data.tet, 2, 3));

        valueStr = values.length === 0 ? "No Effect" : `${values.join(", ")}`;
      }

      return `${entry.name}: ${valueStr}`;
    },
    nerfString(index) {
      const entry = this.entries[index];

      // Display both multiplier and powers, but make sure to give an empty string if there's neither
      const overrideStr = entry.displayOverride;
      let valueStr;

      if (overrideStr) valueStr = `(${overrideStr})`;
      else {
        const values = [];

          if (Decimal.neq(entry.data.mult, 1) && Decimal.neq(entry.data.mult, 0) ) values.push(`x${formatSmall(entry.data.mult, 2, 2)}`);
          if (Decimal.neq(entry.data.pow, 1) && Decimal.neq(entry.data.pow, 0) ) values.push(formatPow(entry.data.pow, 2, 3));
          if (Decimal.neq(entry.data.tet, 1) && Decimal.neq(entry.data.tet, 0)) values.push(formatTet(entry.data.tet, 2, 3));
        
        valueStr = values.length === 0 ? "No Effect" : `(${values.join(", ")})`;
      }

      return `${entry.name}: ${valueStr}`;
    },
    totalString() {
      const resource = this.resource;
      const name = resource.name;
      const overrideStr = resource.displayOverride;
      if (overrideStr) return `${name}: ${overrideStr}`;

      const val = resource.mult;
      return resource.isBase
        ? `${name}: ${formatSmall(val, 2, 2)}`
        : `${name}: x${formatSmall(val, 2, 2)}`;
    },
    applyDilationExp(value, exp) {
      return value.log10().pow(exp).pow10();
    },
    dilationString() {
      const resource = this.resource;
      const baseMult = resource.mult;

      // This is tricky to handle properly; if we're not careful, sometimes the dilation gets applied twice since
      // it's already applied in the multiplier itself. In that case we need to apply an appropriate "anti-dilation"
      // to make the UI look correct. However, this cause some mismatches in individual dimension breakdowns due to
      // the dilation function not being linear (ie. multiply=>dilate gives a different result than dilate=>multiply).
      // In that case we check for isDilated one level down and combine the actual multipliers together instead.
      let beforeMult, afterMult;
      if (this.isDilated && resource.isDilated) {
        const dilProd = new Decimal(this.entries
          .filter(entry => entry.isVisible && entry.isDilated)
          .map(entry => entry.mult)
          .map(val => this.applyDilationExp(val, 1 / this.dilationExponent))
          .reduce((x, y) => x.times(y), DC.D1));
        beforeMult = dilProd.neq(1) ? dilProd : this.applyDilationExp(baseMult, this.dilationExponent.recip());
        afterMult = resource.mult;
      } else {
        beforeMult = baseMult;
        afterMult = this.applyDilationExp(beforeMult, this.dilationExponent);
      }

      const formatFn = resource.isBase
        ? x => formaSmall(x, 2, 2)
        : x => `x${formatSmall(x, 2, 2)}`;
      return `Dilation Effect: Exponent${formatPow(this.dilationExponent, 2, 3)}
        (${formatFn(beforeMult, 2, 2)} ➜ ${formatFn(afterMult, 2, 2)})`;
    },
    isRecent(date) {
      return (this.now - date) < 200;
    }
  },
};
</script>

<template>
  <div :class="containerClass">
    <div class="c-info-list">
      <div class="c-total-mult">
        <b>
          {{ totalString() }}
        </b>
        <span class="c-display-settings">
          <i
            v-if="groups.length > 1"
            v-tooltip="'Change Multiplier Grouping'"
            class="o-primary-btn c-change-display-btn fas fa-arrows-rotate"
            @click="changeGroup"
          />
        </span>
      </div>
      <div
        v-if="isEmpty"
        class="c-no-effect"
      >
        No Active Effects
        <br>
        <br>
        {{ disabledText }}
      </div>
      <div
        v-for="(entry, index) in entries"
        :key="entry.key"
        @mouseover="mouseoverIndex = index"
        @mouseleave="mouseoverIndex = -1"
      >
        <div
          v-if="shouldShowEntry(entry)"
          :class="singleEntryClass(index)"
        >
          <div @click="showGroup[index] = !showGroup[index]"
          >
            <span
              :class="expandIcon(index)"
              :style="expandIconStyle(index)"
            />
            <span
            style="margin-left: 5px"
            :style="barColour(index)"
            v-html="barSymbol(index)"
            />
            {{ entryString(index) }}
          </div>
          <MultiplierBreakdownEntry
            v-if="showGroup[index] && hasChildEntries(index)"
            :resource="entry"
          />
        </div>
      </div>
      <div v-if="isDilated && !isEmpty">
        <div class="c-single-entry c-dilation-entry">
          <div>
            {{ dilationString() }}
          </div>
        </div>
      </div>
      <div
        v-if="resource.key === 'AD_total'"
        class="c-no-effect"
      >
        <div>
          "Base AD Production" is the amount of Antimatter that you would be producing with your current AD upgrades
          as if you had waited a fixed amount of time ({{ formatInt(10) }}-{{ formatInt(40) }} seconds depending on
          your AD count) after a Sacrifice. This may misrepresent your actual production if your ADs have been
          producing for a while, but the relative mismatch will become smaller as you progress further in the game
          and numbers become larger.
        </div>
        <div v-if="inNC12">
          The breakdown in this tab within Normal Challenge 12 may be inaccurate for some entries, and might count
          extra multipliers which apply to all Antimatter Dimensions rather than just the ones which are displayed.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-multiplier-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 100rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  padding: 0.5rem;
  font-weight: normal;
  background-color: var(--color-base);
}

.c-multiplier-entry-root-container {
  min-height: 45rem;
}

.c-stacked-bars {
  position: relative;
  width: 5rem;
  background-color: var(--color-disabled);
  margin-right: 1.5rem;
}

.c-bar-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  opacity: 0.8;
  z-index: 1;
}

.c-bar-highlight {
  animation: a-glow-bar 1s infinite;
}

@keyframes a-glow-bar {
  0% { box-shadow: inset 0 0 0.3rem 0; }
  50% {
    box-shadow: inset 0 0 0.6rem 0;
    filter: brightness(130%);
  }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.c-info-list {
  height: 100%;
  width: 100%;
  padding: 0.2rem;
}

.c-display-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 8rem;
}

.c-change-display-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  margin: 0 0.5rem;
}

.c-total-mult {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.c-no-effect {
  color: var(--color-text);
  user-select: none;
}

.c-single-entry {
  text-align: left;
  color: var(--color-text);
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border: 0.1rem dashed;
  cursor: pointer;
  user-select: none;
}

.c-single-entry-highlight {
  border: 0.1rem solid;
  font-weight: bold;
  animation: a-glow-text 1s infinite;
}

@keyframes a-glow-text {
  50% { background-color: var(--color-accent); }
}

.c-dilation-entry {
  border: 0.2rem solid;
  font-weight: bold;
  animation: a-glow-dilation-nerf 3s infinite;
}

@keyframes a-glow-dilation-nerf {
  50% { background-color: var(--color-bad); }
}
</style>
