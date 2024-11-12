<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerDropdownEntry from "./AutobuyerDropdownEntry";
import AutobuyerInput from "./AutobuyerInput";
import ExpandingControlBox from "@/components/ExpandingControlBox";

export default {
  name: "MetaAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerInput,
    ExpandingControlBox,
    AutobuyerDropdownEntry
  },
  props: {
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      mode: AUTO_META_MODE.AMOUNT,
      increaseWithMult: true,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.meta,
    modes: () => [
      AUTO_META_MODE.AMOUNT,
      AUTO_META_MODE.TIME,
      AUTO_META_MODE.X_HIGHEST,
    ],
    amountMode: () => AUTO_META_MODE.AMOUNT
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.increaseWithMult = this.autobuyer.increaseWithMult;
    },
    modeProps(mode) {
      switch (mode) {
        case AUTO_META_MODE.AMOUNT: return {
          title: "Meta at X MR",
          input: {
            property: "mr",
            type: "decimal"
          },
        };
        case AUTO_META_MODE.TIME: return {
          title: "Seconds (real time)",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AUTO_META_MODE.X_HIGHEST: return {
          title: "X times highest MR",
          input: {
            property: "xHighest",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown Auto Meta mode");
    },
    modeName(mode) {
      return this.modeProps(mode).title;
    },
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    :is-modal="isModal"
    name="Automatic Meta"
  >
    <template #intervalSlot>
      <ExpandingControlBox
        :auto-close="true"
      >
        <template #header>
          <div class="o-primary-btn c-autobuyer-box__mode-select c-autobuyer-box__mode-select-header">
            ▼ Current Setting: ▼
            <br>
            {{ modeName(mode) }}
          </div>
        </template>
        <template #dropdown>
          <AutobuyerDropdownEntry
            :autobuyer="autobuyer"
            :modes="modes"
            :mode-name-fn="modeName"
          />
        </template>
      </ExpandingControlBox>
    </template>
    <template #toggleSlot>
      <AutobuyerInput
        :key="mode"
        :autobuyer="autobuyer"
        v-bind="modeProps(mode).input"
      />
    </template>
  </AutobuyerBox>
</template>

<style scoped>
.o-clickable {
  cursor: pointer;
}
</style>
