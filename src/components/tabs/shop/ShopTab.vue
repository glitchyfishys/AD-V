<script>
import "vue-loading-overlay/dist/vue-loading.css";

import Loading from "vue-loading-overlay";

import Payments from "@/core/payments";

import PrimaryButton from "@/components/PrimaryButton";
import ShopButton from "./ShopButton";

export default {
  name: "ShopTab",
  components: {
    ShopButton,
    Loading,
    PrimaryButton,
  },
  data() {
    return {
      availableSTD: new Decimal(0),
      isLoading: false,
      IAPsEnabled: false,
      creditsClosed: false,
      respecTimeStr: "",
    };
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    },
    enableText() {
      return `In-app Purchases: ${this.IAPsEnabled ? "Enabled" : "Disabled"}`;
    },
  },
  methods: {
    update() {
      this.availableSTD = Decimal.floor(player.IAP.STDcoins);
      this.isLoading = Boolean(player.IAP.checkoutSession.id);
      this.IAPsEnabled = player.IAP.enabled;
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    showStore() {
      if (this.creditsClosed) return;
      SecretAchievement(33).unlock();
      Modal.message.show("You cannot purchase STD coins, they are gained over time");
    },
    onCancel() {
      Payments.cancelPurchase(false);
    },
    toggleEnable() {
      if (ShopPurchaseData.availableSTD.lt(0)) return;
      player.IAP.enabled = !player.IAP.enabled;
      if (ShopPurchaseData.isIAPEnabled) Speedrun.setSTDUse(true);
    },
    respecClass() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-pelle-disabled-pointer": this.creditsClosed,
        "o-primary-btn--disabled": true
      };
    }
  },
};
</script>

<template>
  <div class="tab shop">
    <div class="c-shop-disclaimer">
      Disclaimer: These are not required to progress in the game.
      The game is even less balanced with these.
    </div>
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        label="Disable in-app-purchases:"
        @click="toggleEnable()"
      >
        {{ enableText }}
      </PrimaryButton>
    </div>
    <div class="c-shop-header">
      <span>You have {{ availableSTD }}</span>
      <img
        src="../../../../public/images/std_coin.png"
        class="c-shop-header__img"
      >
      <button
        class="o-shop-button-button"
        @click="showStore()"
      >
        Buy More
      </button>
    </div>
    Note: All numbers on this page are intentionally unaffected by your notation settings
    <div class="l-shop-buttons-container">
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
      />
    </div>
    <loading
      :active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
    />
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-text);
}

.c-shop-disclaimer {
  width: 80%;
  max-width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: black;
  background: var(--color-bad);
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 0.8rem;
}

.t-s1 .c-shop-disclaimer,
.t-s6 .c-shop-disclaimer,
.t-s10 .c-shop-disclaimer {
  color: var(--color-bad);
  background: black;
  border-color: var(--color-bad);
}

.c-login-info {
  font-size: 1.5rem;
}

.c-shop-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.c-shop-header__img {
  height: 40px;
  margin: 0 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: auto;
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
}

.l-shop-buttons-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 93rem;
  margin: auto;
}

.c-shop-header .o-shop-button-button {
  margin: 0;
}
</style>
