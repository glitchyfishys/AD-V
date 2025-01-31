<script>
export default {
  name: "MetaButton",
  data() {
    return {
      isVisible: false,
      gainedMR: new Decimal(0),
      currentMRRate: new Decimal(0),
      peakMRRate: new Decimal(0),
      peakMRRateVal: new Decimal(0),
      currentMR: new Decimal(0),
      canMeta: false,
      metaGoal: new Decimal(0),
      hover: false,
      headerTextColored: true,
      creditsClosed: false,
      showMRRate: false,
      inMetaChallenge: false,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-infinity-button--unavailable": !this.canMeta,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
    rateThreshold: () => 5e10,
    amountStyle() {
      if (this.currentMR.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };
    },
  },
  methods: {
    update() {
      this.isVisible = VUnlocks.metaReset.isUnlocked || PlayerProgress.metaUnlocked();
      if (!this.isVisible) return;
      this.canMeta = Player.canMeta;
      this.metaGoal.copyFrom(Player.metaGoal);
      this.headerTextColored = player.options.headerTextColored;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.inMetaChallenge = false

      const gainedMR = gainedMetaRelays();
      this.currentMR.copyFrom(Currency.metaRelays);
      this.gainedMR.copyFrom(gainedMR);
      this.currentMRRate.copyFrom(gainedMR.div(Decimal.clampMin(0.0005, Time.thisMetaRealTime.totalMinutes)));
      this.peakMRRate.copyFrom(player.records.thisMeta.bestMRmin);
      this.peakMRRateVal.copyFrom(player.records.thisMeta.bestMRminVal);
      this.showMRRate = this.peakMRRate.lte(this.rateThreshold);
    },
    meta() {
      if (!this.canMeta) return;
      requestManualMeta();
    }
  },
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-prestige-button o-meta-button"
    @click="meta"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >

    <template v-if="!canMeta">
      Reach {{ format(metaGoal, 2, 2) }} antimatter and have the last V unlock
    </template>

    <template v-else-if="inMetaChallenge">
      Go Meta to
      <br>
      Begin Mending this Universe
    </template>

    <template v-else>
      <div v-if="!showMRRate" />
      <b>
        Go Meta for
        <span :style="amountStyle">{{ format(gainedMR, 2) }}</span>
        <span v-if="showMRRate"> MR</span>
        <span v-else> {{ pluralize("Meta Relay", gainedMR) }}</span>
      </b>
    </template>
  </button>
</template>

<style scoped>

</style>
