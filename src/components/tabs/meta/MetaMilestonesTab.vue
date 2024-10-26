<script>
import MetaMilestoneButton from "./MetaMilestoneButton";

export default {
  name: "MetaMilestonesTab",
  components: {
    MetaMilestoneButton
  },
  data() {
    return {
      metaCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.meta.metaMilestones)
        .sort((a, b) => a.metas - b.metas)
        .map(config => new MetaMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 4);
    }
  },
  methods: {
    update() {
      this.metaCount.copyFrom(Currency.metas.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 4 + column - 1];
    }
  }
};
</script>

<template>
  <div class="l-eternity-milestone-grid">
    <div>You have {{ quantify("Meta", metaCount, 3) }}.</div>
    <div>
      Meta Completions boost most production
    </div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-eternity-milestone-grid__row"
    >
      <MetaMilestoneButton
        v-for="column in 4"
        :key="row * 4 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-eternity-milestone-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
