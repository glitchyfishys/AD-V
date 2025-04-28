<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import NullRep from "./NullCycle";
import nullUpgrade from "./NullUpgrade"

export default {
  name: "NullTab",
  components: {
    CelestialQuoteHistory,
    NullRep,
    PrimaryButton,
    nullUpgrade
  },
  data() {
    return {
      quote: "",
      upgrades: [],
      abyssalMatter: new Decimal(),
      corruptMatter: new Decimal(),
      amo: 2,
      isUnlocked: false,
      isFocused: false,
      highestUnlocked: 2,
      displayValue: "passcode..."
    };
  },
  computed: {
    symbol: () => Null.symbol,
    runButtonInnerClass() {
      return this.isRunning ? "c-null-run-button__inner--running" : "c-null-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[8].effects()}\n
      ${GameDatabase.celestials.descriptions[8].description()}`;
    },
    isDoomed: () => Pelle.isDoomed,
    posRad(){
      return (42 * ((this.highestUnlocked / 16) ** 0.8)).toString() + '%';
    }
  },
  methods: {
    update() {
      this.isUnlocked = Null.isTabUnlocked;
      this.corruptUnlocked = Null.isCorrupt || Parallax.parallaxes.gte(14);
      this.quote = Null.quote;
      this.abyssalMatter.copyFrom(Currency.abyssalMatter);
      this.corruptMatter.copyFrom(Currency.corruptMatter);
      this.amo = NullCycles.highestUnlocked;
      this.upgrades = NullUpgrades.all;
      this.highestUnlocked = NullCycles.highestUnlocked;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Null's", number: 8 });
    },
      // this should work
    updateDisplayValue() {
      this.displayValue = this.actualValue;
    },
    handleInput(event) {
      const input = event.target.value;
      this.displayValue = input;
      this.actualValue = input;
    },
    handleFocus() {
      this.isFocused = true;
    },
    handleChange(event) {
      console.log(this.displayValue)
      if (HASH(this.displayValue) == Null.passcode) {
        if(Null.isCorrupt) player.celestials.null.isUnlocked |= (1 << 6);
        player.celestials.null.isUnlocked |= (1 << Parallax.parallaxes.min(5).toNumber());
      }
      this.isFocused = false;
      event.target.blur();
    },
    parallaxReset(){
      Parallax.resetStuff();
    },
    corruptReset(){
      Corrupt.resetStuff();
    },
    parallaxInfo(){
      return `Parallax (${Parallax.parallaxes}) <br> Multiply all Cycles by ${formatX(Parallax.boost)}${NullUpgrades.all[7].isUnlocked ? ` & add a ${formatPow(Parallax.powBoost,2,2)}` : ''},
      total ${formatX(Parallax.multiplier,2 ,2)} ${NullUpgrades.all[7].isUnlocked ? ` & a ${formatPow(Parallax.power,2,2)}` : ''} <br> Requires ${format(Parallax.requirement.amount)} 1st Cycle`
    },
    corruptInfo(){
      return `Corrupt (${Corrupt.corrupts}) <br> Multiply AbM by ${formatX(Corrupt.boost)},
      total ${formatX(Corrupt.multiplier,2 ,2)} <br> Requires ${format(Corrupt.requirement.amount)} Parallaxes`
    },
  }
};
</script>

<template>
  <div  class="c-null-tab">
    <div
    v-if="isUnlocked"
    >
        <CelestialQuoteHistory celestial="null" />
        <div>
          You Have <span style="font-size: 2.5rem; color: var(--color-null--base)">{{ format(abyssalMatter, 2, 2) }}</span> Abyssal Matter
          <span
          v-if="corruptUnlocked"
          > 
          and
          <span style="font-size: 2.5rem; color: var(--color-null--corrupt)"> {{format(corruptMatter, 2, 2)}}</span>
          Corrupt Matter
        </span>
        </div>
        <div
        style='position: relative; width: 63rem; height: 63rem; justify-self: center;margin: 25px'
        >
        <svg data-v-aa8473bf="" class="l-alchemy-orbit-canvas">
          <circle data-v-aa8473bf="" cx="50%" cy="50%" :r="posRad" class="o-alchemy-orbit">
          </circle>
        </svg>
        <NullRep
          v-for="k in amo"
          :key="k"
          :tier="k"
        />
      </div>
      <PrimaryButton
      class="parallax"
      @click="parallaxReset"
      v-html="parallaxInfo()"
      />
      <PrimaryButton
      class="corrupt"
      @click="corruptReset"
      v-if="corruptUnlocked"
      v-html="corruptInfo()"
      />
      <div class="o-null-upgrades">
        <div
        v-for="ug in upgrades">
          <div>
            <nullUpgrade
            :upgrade="ug"
            ></nullUpgrade>
          </div>
        </div>
      </div>
      
    </div>
    <div
    v-else
    >
    <CelestialQuoteHistory celestial="null" /> <br><br>
    <input
      :value="displayValue"
      class="o-autobuyer-input"
      @focus="handleFocus"
      @change="handleChange"
      @input="handleInput"
    >

    </div>

</div>
</template>

<style scoped>
.c-null-tab {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.o-null-upgrades{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.o-autobuyer-input--invalid {
  background-color: var(--color-bad);
}

.s-base--dark .o-autobuyer-input--invalid,
.t-s1 .o-autobuyer-input--invalid {
  background-color: var(--color-bad);
}

.parallax {
  height: 65px;
  background-image: linear-gradient(90deg, red, blue);
  border: cyan 3px;
  width: 1030px;
  margin: 2px;
}

.corrupt {
  height: 65px;
  background-image: linear-gradient(90deg, green, purple);
  border: white 3px;
  width: 1030px;
  margin: 2px;
}

</style>
