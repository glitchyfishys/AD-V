<script>
import NormalAchievement from "./NormalAchievement";

export default {
  name: "NormalAchievementRow",
  components: {
    NormalAchievement
  },
  props: {
    row: {
      type: Array,
      required: true
    },
    isObscured: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isCompleted: false,
      isHidden: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    },
    inRow(){
      return this.row.filter(x => x);
    },
  },
  methods: {
    update() {
      this.isCompleted = this.row.every(a => a ? a.isUnlocked : true );
      this.isHidden = this.isCompleted && player.options.hideCompletedAchievementRows;
    },
  }
};
</script>

<template>
  <div
    v-if="!isHidden"
    :class="classObject"
  >
    <normal-achievement
      v-for="(achievement, i) in inRow"
      :key="i"
      :achievement="achievement"
      :is-obscured="isObscured"
      class="l-achievement-grid__cell"
    />
  </div>
</template>
