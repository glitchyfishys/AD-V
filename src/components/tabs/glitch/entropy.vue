<script>
  
import GlitchRift from "./glitchrift";
  
export default {
  name: "entropy",
  components: {
    GlitchRift
  },
  computed: {
    rifts() {
      return GlitchRifts.all;
    },
  },
  methods: {
    totalrifts() {
      return GlitchRifts.all.length;
    }
  },
};
</script>

<template>
    <div class="c-entropy-infotext">
      Hello destroyer.
      Fill these please.
      <br>
      They will fill based on how many of my challenges you complete.
      <br>
      Also some challenges can not be compleated later so do them before than, I will warn you when you are going to be unable to complete them

      <div>
      <GlitchRift
          v-for="rift in rifts"
          :key="rift.config.id"
          :rift="rift"
        />
        </div>
    </div>
  
</template>

<style scoped>
.c-reality-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
}
</style>
