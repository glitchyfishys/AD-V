<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CanteRep",
  components: {
    CelestialQuoteHistory,
    PrimaryButton,
  },
  props: {
    tier:{
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      unlockReq: '',
      unlocked: false,
      purged: false,
      rep: {},
      amount: new Decimal(),
      cost: new Decimal(),
      multiplier: new Decimal(),
    };
  },
  computed: {
    symbol: () => Cante.symbol,
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.rep = CanteReplicator(this.tier);
      this.unlocked = this.rep.unlocked;
      this.unlockReq = this.rep.unlockReq;
      this.cost.copyFrom(this.rep.cost);
      this.amount.copyFrom(this.rep.amount);
      this.multiplier.copyFrom(this.rep.multiplier);
      this.purged  = Cante.purged;
    },
    buy(bulk = false){
      if(this.unlocked){
        this.rep.buy(bulk);
      }
    }
  }
};
</script>

<template>
  <PrimaryButton
  :class="this.tier > 5 ? 'c-cante-button-chaos': 'c-cante-button'"
  v-if='(purged && this.tier > 5) || this.tier < 6'
  @click.exact="buy(false)"
  @click.shift.exact="buy(true)"
  >
    {{rep.shortDisplayName}} Replicator
    <div v-if="unlocked">
        {{ format(amount, 2, 2) }} <br> x{{ formatSmall(multiplier) }}
        <br>
      <div>
        Cost: {{ format(cost, 2) }} Artificial Matter
      </div>
    </div>
    <div v-else>
      Unlock Requirement:
      {{ unlockReq }}
    </div>
  </PrimaryButton>
</template>

<style scoped>
.c-cante-button {
  height: 100px;
  width: 200px;
  background: var(--color-cante--base);
  margin: 5px;
  border-color: #1d4087;
}

.c-cante-button-chaos {
  height: 100px;
  width: 200px;
  background: var(--color-cante--chaos);
  margin: 5px;
  border-color: #1d4087;
}
</style>
