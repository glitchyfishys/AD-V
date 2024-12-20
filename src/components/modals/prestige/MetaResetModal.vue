<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "MetaResetModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedMetas: new Decimal(),
      gainedMetaRelays: new Decimal(),
    };
  },
  computed: {
    isFirst() {
      return !PlayerProgress.metaUnlocked();
    },
    message() {
      return `Upon going Meta, all stuff upto Glitch, V-EX and Chaos Dimensions are reset.`;
    },
    mrGainInfo() {
      return `You will gain ${quantify("Meta", this.gainedMetas, 2, 0)}
        and ${quantify("Meta Relay", this.gainedMetaRelays, 2, 0)}.`;
    },
    startingResources() {
      return `You will start your next Meta with nothing but the START Reality Perk`;
    }
  },
  methods: {
    update() {
      this.gainedMetas = gainedMetas().round();
      this.gainedMetaRelays = gainedMetaRelays().round();
    },
    handleYesClick() {
      startManualMeta();
    }
  },
};
</script>

<template>
  <ResetModal
    header="You are about to go Meta"
    :message="message"
    :gained-resources="mrGainInfo"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    :alternate-condition="false"
    :alternate-text="message"
    :confirm-option="'meta'"
  />
</template>
