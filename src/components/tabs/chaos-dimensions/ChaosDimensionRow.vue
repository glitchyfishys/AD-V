<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import { ChaosDimension } from "../../../core/globals";

export default {
  name: "ModernChaosDimensionRow",
  components: {
    GenericDimensionRowText
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(),
      amount: new Decimal(),
      bought: new Decimal(),
      cost: new Decimal(),
      rateOfChange: new Decimal(),
      isAffordable: false,
      isShown: false,
      amountDisplay: "",
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return `${ChaosDimension(this.tier).shortDisplayName} Chaos Dimension`;
    },
    costDisplay() {
      return format(this.cost);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.isCapped) return `You can not purchase more than ${format(1e10)} Chaos Dimensions`;
      return `Purchased ${format(this.bought)} times`;
    },
    buttonPrefix() {
      if (!this.isUnlocked) return "Locked";
      return `Buy Max`;
    },
    buttonValue() {
      if (this.isCapped) return "Capped";
      const prefix = "Cost: ";
      const suffix = "CC";
      return `${prefix}${this.costDisplay} ${suffix}`;
    },
    hasLongText() {
      return this.buttonValue.length > 15;
    },
  },
  methods: {
    update() {
      const tier = this.tier;

      const dimension = ChaosDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      this.isCapped = dimension.bought.gte(1e100);

      this.cost.copyFrom(dimension.cost)
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.cost.copyFrom(dimension.cost);

      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isShown = true;
      this.amountDisplay = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount,2);
    },
    buy() {
      buyMaxChaosDimension(this.tier);
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    },
    buttonClass() {
      return {
        "o-primary-btn o-primary-btn--new": true,
        "o-primary-btn--disabled": !this.isAffordable || !this.isUnlocked || this.isCapped,
      };
    },
    buttonTextClass() {
      return {
        "button-content l-modern-buy-ad-text": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-chaos-dim c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountDisplay"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ boughtTooltip }}
      </div>
      <button
        :class="buttonClass()"
        @click="buy"
      >
        <div :class="buttonTextClass()">
          <div>
            {{ buttonPrefix }}
          </div>
          <div :class="{ 'l-dim-row-small-text': hasLongText }">
            {{ buttonValue }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l-modern-buy-ad-text {
  display: flex;
  flex-direction: column;
}

.o-non-clickable {
  cursor: auto;
}

</style>
