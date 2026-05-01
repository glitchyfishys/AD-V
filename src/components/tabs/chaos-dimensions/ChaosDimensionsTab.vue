<script>
import PrimaryButton from "@/components/PrimaryButton";
import ChaosDimensionRow from "./ChaosDimensionRow.vue";

export default {
  name: "ChaosDimensionsTab",
  components: {
    PrimaryButton,
    ChaosDimensionRow,
  },
  data() {
    return {
      cores: "0",
      gain: "0",
      RFGain: "",
      plynia: false,
      Pmul: new Decimal(),
      Preq: new Decimal(),
      amount: new Decimal(),
      tier: 'STRING!'
    };
  },
  methods: {
    update() {
      this.cores = format(Currency.chaosCores.value,2);
      this.gain = Glitch.riftToCoreGain;
      this.RFGain = Glitch.chaosCoresRFBoost;

      this.plynia = HardChallengerUpgrade(6).isBought;
      this.Pmul = Plynia.boost;
      this.Preq = Plynia.requirement.amount;
      this.amount = Plynia.plynias;
      this.tier = ChaosDimension(Math.min(12, 8 + Plynia.plynias.toNumber())).shortDisplayName;

    },
    riftToCore() {
      Glitch.riftToCore();
    },
    STEffect(){
      return formatPercents(Glitch.chaosCoresBoost.sub(1));
    },
    maxAll() {
      maxAllChaos();
    },
    prestige() {
      Plynia.resetStuff();
    }
  }
};
</script>

<template>
  <div class="l-antimatter-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll">
        Max all
      </PrimaryButton>
    </div>

    <div>
      you have
      <span class="l-CC-text">
        {{this.cores}}
      </span>
      Chaos Cores
    </div>

    <div>
      Chaos Cores Boost Galaxy strength by
      <span class="l-TSE">
        {{STEffect()}}
      </span>
      and
      <span class="l-RFE">
        x{{ format(this.RFGain, 2, 2) }}
      </span>
      Rift Force gain 
    </div>
      
    <PrimaryButton
    @click="riftToCore">
    convert all of Rift Force to {{gain}} Chaos Cores
    </PrimaryButton>


    <div class="l-dimensions-container">
      <ChaosDimensionRow
        v-for="tier in 12"
        :key="tier"
        :tier="tier"
      />
    </div>

    <div
      v-if="plynia"
    >
      <div style="font-size: 2rem">
        Plynias ({{ amount }})
      </div>
      
      <PrimaryButton
      style="height: unset; width: unset;"
      @click="prestige">
        Reset Chaos Dimenions and Chaos Core for a<br>
        {{ formatX(Pmul) }} multiplier to All Chaos Dimensions<br>
        Requires {{ format(Preq) }} {{ tier }} Chaos Dimensions <br>
      </PrimaryButton>
    </div>
    

  </div>
</template>

<style scoped>
.l-CC-text {
  color: red;
  font-size: 25px;
}

.l-TSE {
  color: purple;
  font-size: 25px;
}

.l-RFE {
  color: lime;
  font-size: 25px;
}
</style>
