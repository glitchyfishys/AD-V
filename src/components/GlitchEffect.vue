<script>
export default {
  name: "GlitchEffect",

  computed: {
    showThisHintText() {
      // Accessing the player object in this computed is intentional for the sake of performance.
      // Always access the player object in update method and store required stuff in component data.
      return this.$viewModel.shiftDown || player.options.showHintText[this.type];
    },
  },
  methods:{
    clipping(){
      const l =  () => `${Math.floor(Math.random() * 31)}%`;
      const u =  () => `${Math.floor(Math.random() * 31) + 70}%`;
      return {
        clipPath: `polygon(${l()} ${l()}, ${u()} ${l()}, ${u()} ${u()}, ${l()} ${u()})`,
        position: 'absolute',
        transform: 'translateX(-50%)',
        filter: 'invert(1)'
      };
    },
  }
};
</script>

<template>
  <span >
    <span 
    v-for="a in 3"
    :style="clipping()"
    >
      <slot />
    </span>
  </span>
</template>
<style scoped>

</style>