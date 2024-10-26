<script>
export default {
  name: "MetaCurrencyHeader",
  data() {
    return {
      currencyValue: new Decimal(),
      currencyName: "",
    };
  },
  methods: {
    update() {
      this.currencyValue.copyFrom(Currency.metaRelays.value);
      this.currencyName = pluralize("Meta Relay", this.currencyValue);
    },
  }
};
</script>

<template>
  <div class="c-meta-currency">
    You have
    <b class="c-meta-tab__meta-relays">
      {{ format(currencyValue, 2) }}
    </b>
    {{ currencyName }}.
  </div>
</template>

<style scoped>
.c-meta-currency {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.c-meta-tab__meta-relays{
  color: var(--color-meta);
}
</style>
