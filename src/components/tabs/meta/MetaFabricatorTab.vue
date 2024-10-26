<script>
import MetaUpgradeButton from "./MetaUpgradeButton";

export default {
  name: "MetaFabricatorTab",
  components: {
    MetaUpgradeButton
  },
  computed: {
    upgrades: () => MetaFabricatorUpgrades.all,
    costScalingTooltip: () => `Prices start increasing faster above ${format(1e30)} RM and then even faster
    above ${format(Decimal.NUMBER_MAX_VALUE, 1)} MR`,
    possibleTooltip: () => `Checkered upgrades are impossible to unlock this Reality. Striped upgrades are
    still possible.`,
    lockTooltip: () => `This will only function if you have not already failed the condition or
    unlocked the upgrade.`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-reality-upgrade-infotext">
      The first row of upgrades can be purchased endlessly for increasing costs
      <span :ach-tooltip="costScalingTooltip">
        <i class="fas fa-question-circle" />
      </span>
      and the rest are single-purchase.
      <br>
      ONLY THE REBUYABLE UPGRADES AND THE FIRST TEN SINGLE PURCHASE HAVE BEEN IMPLEMENTED
      <br>
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <MetaUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)] ? upgrades[id(row, column)] : upgrades[0]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-meta-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
}

.l-meta-upgrade-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 1.2rem;
}

.l-meta-upgrade-grid__row {
  display: flex;
  flex-direction: row;
}

</style>
