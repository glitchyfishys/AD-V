<script>
import ModernChaosDimensionsTab from "./ModernChaosDimensionsTab";

export default {
  name: "ChaosDimensionsTab",
  components: {
    ModernChaosDimensionsTab
  },
  computed: {
    activeComponent() {
      return"ModernChaosDimensionsTab";
        
    }
  },
};
</script>

<template>
  <component :is="activeComponent" />
</template>
