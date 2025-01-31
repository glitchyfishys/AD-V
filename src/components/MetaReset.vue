<script>
export default {
  name: "MetaReset",

  computed: {
    showThisHintText() {
      // Accessing the player object in this computed is intentional for the sake of performance.
      // Always access the player object in update method and store required stuff in component data.
      return this.$viewModel.shiftDown || player.options.showHintText[this.type];
    },
  },

};
</script>

<template>
  <div>
      <div class="o-meta-reset outer-connect" />
      <div class="o-meta-reset outer" />
      <div class="o-meta-reset inner-connect" />
      <div class="o-meta-reset inner" />
      <div class="o-meta-reset meta" />
  </div>
</template>
<style scoped>
div{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 512px;
  height: 512px;
  z-index: 15;
  zoom: 1.5;
  user-select: none;
  pointer-events: none;
  animation: a-metazebg 10s infinite linear;
}

.outer-connect {
  animation: spin 5s linear infinite;
  background-position-y: 0px;
}

.outer {
  animation: spin 5s linear reverse infinite;
  background-position-y: -512px;
}

.inner-connect {
  animation: spin 2.5s linear reverse infinite;
  background-position-y: -1024px;
}

.inner {
  animation: spin 2.5s linear infinite;
  background-position-y: -1536px;
}

.meta {
  animation: meta 10s linear infinite;
  background-position-y: -2048px;
}

@keyframes spin {
  0%{
    transform: translateX(-50%) translateY(-50%) rotateZ(0deg);
  }
  100%{
    transform: translateX(-50%) translateY(-50%) rotateZ(360deg);
  }
}

@keyframes meta {
  15%{
    transform: translateX(-50%) translateY(-50%) scale(1);
    filter: blur(0px);
  }
  50%{
    transform: translateX(-50%) translateY(-50%) scale(8);
    filter: blur(12px);
  }
  85%{
    transform: translateX(-50%) translateY(-50%) scale(1);
    filter: blur(0px);
  }
}

</style>