<script>
import PrimaryButton from "@/components/PrimaryButton";
import ChaosDimensionRow from "./ModernChaosDimensionRow.vue";
import { Glitch } from "../../../core/globals";

export default {
  name: "ModernChaosDimensionsTab",
  components: {
    PrimaryButton,
    ChaosDimensionRow,
  },
  data() {
    return {
      cores: "0",
      gain: "0",
      RFGain: "",
    };
  },
  methods: {
    update() {
      this.cores = format(Currency.chaosCores.value,2);
      this.gain = Glitch.riftToCoreGain;
      this.RFGain = format(Currency.chaosCores.value.mul(Currency.chaosCores.value.log(2)).pow(5), 2);
    },
    riftToCore() {
      Glitch.riftToCore();
    },
    STEffect(){
      return formatPercents(Glitch.chaosCoresBoost - 1);
    },
    maxAll() {
      maxAllChaos();
    },
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
      Chaos Cores will Boost Tickspeed by
      <span class="l-TSE">
        {{STEffect()}}
      </span>
      per galaxy and
      <span class="l-RFE">
        x{{ this.RFGain }}
      </span>
      Rift Force gain 
    </div>
      
    <PrimaryButton
    @click="riftToCore">
    convet all of Rift Force to {{gain}} Chaos Cores
    </PrimaryButton>


    <div class="l-dimensions-container">
      <ChaosDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
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
