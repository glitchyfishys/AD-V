<script>
import BlobSnowflakes from "@/components/BlobSnowflakes";
import TachyonParticles from "@/components/tabs/time-dilation/TachyonParticles";
import MetaReset from "@/components/MetaReset";

export default {
  name: "BackgroundAnimations",
  components: {
    BlobSnowflakes,
    TachyonParticles,
    MetaReset
  },
  data() {
    return {
      animations: {
        blob: false,
        animateTachyons: false,
        metaReset: false
      }
    };
  },
  methods: {
    update() {
      this.animations.blob = Theme.currentName() === "S11";
      this.animations.animateTachyons = player.options.animations.tachyonParticles &&
        Tabs.current[this.$viewModel.subtab].name === "Time Dilation";
      this.animations.metaReset = MetaAnimation;
    }
  },
};
</script>

<template>
  <div
    id="ui-background-animations"
    class="l-background-animations"
  >
    <BlobSnowflakes v-if="animations.blob" />
    <TachyonParticles v-if="animations.animateTachyons" />
    <MetaReset v-if="animations.metaReset"/>
  </div>
</template>

<style scoped>

</style>