<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "NullCycle",
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
      cyc: {},
      amount: new Decimal(),
      cost: new Decimal(),
      multiplier: new Decimal(),
      highestUnlocked: 2
    };
  },
  computed: {
    symbol: () => Null.symbol,
    isDoomed: () => Pelle.isDoomed,
    pos() {
      const dst = 42 * ((this.highestUnlocked / 16) ** 0.8);
      const step = Math.PI_2 / this.highestUnlocked;
      const offset = (step * (0.75 + (0.25 * (this.highestUnlocked - 3))));
      const a = (this.tier - 1) * step - offset;
      const x = Math.cos(a) * dst;
      const y = Math.sin(a) * dst;
      return {
        left: 50 + x + '%',
        top: 50 + y + '%',
      }
    },
  },
  methods: {
    update() {
      this.cyc = NullCycle(this.tier);
      this.unlocked = this.cyc.unlocked;
      this.unlockReq = this.cyc.unlockReq;
      this.cost.copyFrom(this.cyc.cost);
      this.amount.copyFrom(this.cyc.amount);
      this.multiplier.copyFrom(this.cyc.multiplier);
      this.highestUnlocked = NullCycles.highestUnlocked;
    },
    buy(bulk = false){
      if(this.unlocked){
        this.cyc.buy(bulk);
      }
    },
    data() {
      return `Cost: ${format(this.cost, 2)} Abyssal Matter`
    }
  }
};
</script>

<template>
  <PrimaryButton
  :class="this.tier > 8 ? 'c-null-button-chaos': 'c-null-button'"
  :style="pos"
  @click.exact="buy(false)"
  @click.shift.exact="buy(true)"
  >
    <div class="c-cycle-num">
      {{cyc.shortDisplayName}} Cycle
    </div>
    <div v-if="unlocked">
        {{ formatSmall(amount, 2, 2) }} <br>
        x{{formatSmall(multiplier) }} 
        <span style="font-size: 11px;">
          Cost: {{ format(this.cost, 2, 2) }} AbM
        </span>
    </div>
  </PrimaryButton>
</template>

<style scoped>
.c-null-button {
  height: 100px;
  width: 100px;
  background: var(--color-null--base);
  margin: 5px;
  border-color: #1d4087;
  position: absolute;
  margin-top: -50px;
  margin-left: -50px;
  border-radius: 50%;
}

.c-null-button-chaos {
  height: 100px;
  width: 100px;
  background: var(--color-null--corrupt);
  margin: 5px;
  border-color: #26045d;
  position: absolute;
  margin-top: -50px;
  margin-left: -50px;
  border-radius: 50%;
}

.c-cycle-num {
  top: -15px;
  left: 10px;
  width: 80px;
  z-index: 2;
  position: absolute;
  color: var(--color-text);
  border-radius: 11px;
  border: solid 2px white;
  background-image: linear-gradient(white 5%, black 25% 75%, white 100%);
}

</style>
