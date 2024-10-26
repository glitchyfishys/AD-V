<script>
export default {
  name: "MetaMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    req() {
      return this.config.req;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-meta-milestone__reward": true,
        "o-meta-milestone__reward--locked": !this.isReached,
        "o-meta-milestone__reward--reached": this.isReached,
        "o-meta-milestone__reward--small-font": this.reward.length > 80
      };
    },
    activeCondition() {
      return this.config.activeCondition ? this.config.activeCondition() : null;
    },
    isDoomed: () => Pelle.isDoomed,
    isUseless() {
      return this.isDoomed && this.config.pelleUseless;
    }
  },
  methods: {
    update() {;
      this.isReached = this.milestone.isReached;
    }
  }
};
</script>

<template>
  <div
    v-if="!config.invisible"
    class="l-eternity-milestone"
  >
    <span class="o-eternity-milestone__goal">
      {{ req }}:
    </span>
    <button
      v-tooltip="activeCondition"
      :class="rewardClassObject"
    >
      {{ reward }}
    </button>
  </div>
</template>

<style scoped>

</style>
