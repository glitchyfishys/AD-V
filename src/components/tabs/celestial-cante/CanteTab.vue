<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import CanteRep from "./CanteRep";
import canteUpgrade from "./CanteUpgrade"

export default {
  name: "CanteTab",
  components: {
    CelestialQuoteHistory,
    CanteRep,
    PrimaryButton,
    canteUpgrade,
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
    symbol: () => Cante.symbol,
    runButtonOuterClass() {
      return {
        "l-cente-run-button": true,
        "c-cente-run-button": true,
        "c-cente-run-button--running": this.isRunning,
        "c-cente-run-button--not-running": !this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-cente-run-button__inner--running" : "c-cente-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[7].effects()}\n
      ${GameDatabase.celestials.descriptions[7].description()}`;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.quote = Cante.quote;
      this.runUnlocked = false;
      this.isRunning = false;
      this.artMatter.copyFrom(Currency.artificialMatter);
      this.chaosMatter.copyFrom(Currency.chaosMatter);
      this.artGain = format(this.apendingAM(), 2, 2);
      this.chaosGain = format(CanteReplicators.chaosMatterGain, 2, 2)
      this.upgrades = CanteUpgrades.all;
      this.data.purgeAvaliable = Currency.artificialMatter.gte('1e50000');
      this.data.hasPurge = Cante.purged;
      this.chaosEffect.copyFrom(Decimal.NUMBER_MAX_VALUE.pow(Currency.chaosMatter.value.add(10).log10().pow(2)));
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Cante's", number: 7 });
    },
    reforge(){
      CanteReplicators.reforge();
    },
    purge(){
      CanteReplicators.purge();
    },
    apendingAM(){
      return CanteReplicators.totalArtMatterGain();
    },
    softCaps(){
      return `
      1e308 : ^0.003 <br>
      1e1000 : ^0.05 <br>
      1e1000000 : ^ 0.1 <br>
      1e1E20 : ^ 0.3 <br>
      1e1E80 : ^ 0.5 <br>
      1e1E150 : ^ 0.8 <br>
      1e1E250 : ^ 0.99 <br>
      `
    }
  }
};
</script>

<template>
  <div>
      <CelestialQuoteHistory celestial="cante" />
    <div>
      <div>
        You Have <span style="font-size: 2.5rem; color: var(--color-cante--base)">{{ format(artMatter, 2, 2) }}</span> Artificial Matter
        <span v-if="data.hasPurge">
          And <span style="font-size: 2.5rem; color: #ff5555">{{ format(chaosMatter, 2, 2) }}</span> Chaotic Matter
        </span><br>
        Which multiplies Meta Relay gain up to {{ format(chaosEffect, 2, 2) }} Artificial Matter.
        <span v-if="data.hasPurge">
          Which amplifies the per purchase multiplier, base multiplier and ArtM effect.
        </span><br>
        <br>
        shift clicking buys max
        softcaps
        <span v-tooltip="softCaps()"><i class="fas fa-question-circle"></i></span><br>

      </div><br>
      <div class="c-cante-tab">
        <div
        v-for="k in 10"
        >
          <CanteRep
          :key="k"
          :tier="k"
          />
        </div>
      </div>
      <PrimaryButton
      class="o-reforge"
      @click="reforge"
      >
        Reforge your Replicators for {{ artGain }} Artificial Matter.<br>
        This only applies to Replicators past {{ format(1.79e308, 2) }}.
      </PrimaryButton>
      <PrimaryButton
      class="o-purge"
      v-if="data.hasPurge || data.purgeAvaliable"
      @click="purge"
      >
        Purge your Replicators, Upgrades and Artificial Matter for {{ chaosGain }} Chaotic Matter.<br>
        req: {{ format('1e75000', 2, 2) }} Artificial Matter.
      </PrimaryButton>

      <div class="o-cante-upgrades">
        <div
        v-for="ug in upgrades">
          <div>
            <canteUpgrade
            :upgrade="ug"
            ></canteUpgrade>
          </div>
        </div>
      </div>
      
    </div>
</div>
</template>

<style scoped>
.c-cante-tab {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.o-reforge {
  width: 80%;
  height: 50px;
  border-color: white;
  background: linear-gradient(90deg, #224db8 0%, var(--color-cante--base) 50%, #224db8 100%);
  animation: unpulse 10s linear forwards infinite;
  background-size: 10%;
}

.o-reforge:hover {
  animation: pulse 10s linear forwards infinite;
  background-size: 10%;
}

@keyframes pulse {
  0%{
    background-position: 0% 0px;
  } 
  100%{
    background-position: -100% 0px;
  } 
}

@keyframes unpulse {
  0%{
    background-position: 0% 0px;
  } 
  100%{
    background-position: 100% 0px;
  } 
}

.o-cante-upgrades{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.o-purge {
  width: 80%;
  height: 50px;
  border-color: white;
  background: radial-gradient(red var(--y), var(--color-cante--base) var(--x));
  animation: redpulse 10s linear infinite;
}

.o-purge:hover {
  animation: redunpulse 10s linear infinite;
}

@property --x {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 100%;
}
@property --y {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

@keyframes redpulse {
  0%{
    --x: 0%;
    --y: 0%;
  } 
  25%{
    --x: 80%;
    --y: 45%;
  } 
  75%{
    --x: 50%;
    --y: 5%;
  } 
  100%{
    --x: 0%;
    --y: 0%;
  } 
}

@keyframes redunpulse {
  0%{
    --x: 100%;
    --y: 100%;
  } 
  25%{
    --x: 80%;
    --y: 20%;
  } 
  75%{
    --x: 0%;
    --y: 0%;
  } 
  100%{
    --x: 100%;
    --y: 100%;
  } 
}

</style>
