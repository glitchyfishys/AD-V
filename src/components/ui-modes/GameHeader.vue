<script>
import HeaderBlackHole from "./HeaderBlackHole";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";
import HeaderChallengeEffects from "./HeaderChallengeEffects";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
  },
  data() {
    return {
      hasReality: false,
    };
  },
  methods: {
    update() {
      this.hasReality = PlayerProgress.realityUnlocked();
    },
  },
};
</script>

<template>
  <div>
    
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <HeaderPrestigeGroup />
    
    <GameSpeedDisplay v-if="hasReality" />
    <br v-if="hasReality">
    <HeaderBlackHole />
    <br>
    Hi classic user, I would like to say that the classic UI gets updated last so some things don't display
  </div>
</template>

<style scoped>

</style>
