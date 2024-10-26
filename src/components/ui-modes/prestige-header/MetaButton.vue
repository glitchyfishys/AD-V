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
      if (!this.headerTextColored || this.currentMR.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.substring(0, 2), 16),
          parseInt(textHexCode.substring(2, 4), 16),
          parseInt(textHexCode.substring(4), 16)
        ],
        [0, 255, 0]
      ];
      const ratio = this.gainedMR.log10() / this.currentMR.log10();
      const interFn = index => {
        if (ratio < 0.9) return stepRGB[0][index];
        if (ratio < 1) {
          const r = 10 * (ratio - 0.9);
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio < 1.1) {
          const r = 10 * (ratio - 1);
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
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
      this.currentMRRate.copyFrom(gainedMR.dividedBy(Math.clampMin(0.0005, Time.thisMetaRealTime.totalMinutes.toNumber())));
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
      Reach {{ format(metaGoal, 2, 2) }} antimatter and have the last V achievement
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
