<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "MetaUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-meta-upgrade-btn--useless": this.isUseless,
        "c-meta-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-meta-upgrade-btn--unavailable": !this.isBought && !this.canBeBought,
        "c-meta-upgrade-btn--available": !this.isBought && !this.canBeBought,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    isUseless() {
      return Pelle.disabledRUPGs.includes(this.upgrade.id) && Pelle.isDoomed;
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      //Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = false;
      // if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.metaUpgrade(upgrade.id).isActive;
    },
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-meta-upgrade-btn c-meta-upgrade-btn"
      @click="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span :class="{ 'o-pelle-disabled': isUseless }">
        <DescriptionDisplay :config="config" />
        <template>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Meta Relay"
          />
        </template>
      </span>
    </button>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
    />
  </div>
</template>

<style scoped>
.l-meta-upgrade-btn {
  display: flex;
  flex-direction: column;
  width: 12rem;
  height: 12rem;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 1.2rem;
  padding: 0 0.5rem;
}

.c-meta-upgrade-btn {
  text-align: center;
  font-family: Typewriter, serif;
  font-size: 1rem;
  color: var(--color-meta-light);
  background-color: #222222;
  border: var(--var-border-width, 0.2rem) solid var(--color-meta-dark);
  border-radius: var(--var-border-radius, 0.5rem);
  transition-duration: 0.15s;
  cursor: pointer;
}

.c-meta-upgrade-btn:hover {
  color: black;
  background-color: var(--color-meta-light);
}

.c-meta-upgrade-btn--unavailable {
  color: var(--color-meta-light);
  background-color: #444444;
  cursor: default;
}

.c-meta-upgrade-btn--unavailable:hover {
  color: var(--color-meta-light);
  background-color: #444444;
}

.c-meta-upgrade-btn--useless {
  background-color: var(--color-pelle--base);
  border-color: #4a110b;
  filter: grayscale(50%);
  cursor: default;
}

.c-meta-upgrade-btn--useless:hover {
  color: var(--color-meta-light);
  background-color: var(--color-pelle--base);
  filter: grayscale(50%);
}

.c-meta-upgrade-btn--bought {
  color: var(--color-meta-light);
  background-color: var(--color-meta);
  border-color: var(--color-meta-dark);
  cursor: default;
}

.c-meta-upgrade-btn--bought:hover {
  color: var(--color-meta-light);
  background-color: var(--color-meta);
}
</style>
