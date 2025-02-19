<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import GlitchEffect from "@/components/GlitchEffect";
import NullRep from "./NullCyclee";
import nullUpgrade from "./NullUpgrade"

export default {
  name: "NullTab",
  components: {
    CelestialQuoteHistory,
    NullRep,
    PrimaryButton,
    nullUpgrade,
    GlitchEffect
  },
  data() {
    return {
      runUnlocked: false,
      quote: "",
      isRunning: false,
      artMatter: new Decimal(),
      chaosMatter: new Decimal(),
      chaosEffect: new Decimal(),
      artGain: '',
      data: {
        hasPurge: false,
        purgeAvaliable: false,
      }
    };
  },
  computed: {
    symbol: () => Null.symbol,
    runButtonOuterClass() {
      return {
        "l-null-run-button": true,
        "c-null-run-button": true,
        "c-null-run-button--running": this.isRunning,
        "c-null-run-button--not-running": !this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-null-run-button__inner--running" : "c-null-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[8].effects()}\n
      ${GameDatabase.celestials.descriptions[8].description()}`;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.quote = Null.quote;
      this.runUnlocked = false;
      this.isRunning = false;
      this.artMatter.copyFrom(Currency.artificialMatter);

    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Null's", number: 8 });
    },
  }
};
</script>

<template>
  <div>
      <CelestialQuoteHistory celestial="null" />
    <div>
      <div>
        You Have <span style="font-size: 2.5rem; color: var(--color-null--base)">{{ format(artMatter, 2, 2) }}</span> Abyssl Matter
      </div>
      <div class="c-null-tab">
        <div
        v-for="k in 10"
        >
          <NullRep
          :key="k"
          :tier="k"
          />
        </div>
      </div>

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
</div>
</template>

<style scoped>
.c-null-tab {
  display: flex;
  justify-content: nullr;
  flex-wrap: wrap;
}

.o-null-upgrades{
  display: flex;
  justify-content: nullr;
  flex-wrap: wrap;
}

</style>
