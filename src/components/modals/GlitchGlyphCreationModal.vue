<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "GlitchGlyphCreationModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      glitchGlyphLevel: 0,
      // This contains an array where each entry is an array looking like [4000, "glitchpow"]
      possibleEffects: [],
    };
  },
  methods: {
    update() {
      this.glitchGlyphLevel = AlchemyResource.glitch.effectValue;
      const glitchEffectConfigs = GlyphEffects.all
        .filter(eff => eff.glyphTypes.includes("glitch"))
        .sort((a, b) => a.bitmaskIndex - b.bitmaskIndex);
      const minGlitchEffectIndex = glitchEffectConfigs.map(cfg => cfg.bitmaskIndex).min();
      this.possibleEffects = glitchEffectConfigs
        .map(cfg => [glitchGlyphEffectLevelThresholds[cfg.bitmaskIndex - minGlitchEffectIndex], cfg.id]);
    },
    createGlitchGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show("No available inventory space; Sacrifice some Glyphs to free up space.",
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.glitchGlyph(this.glitchGlyphLevel));
      Achievement(192).unlock();
      this.emitClose();
    },
    formatGlyphEffect(effect) {
      if (this.glitchGlyphLevel < effect[0]) return `(Requires Glyph level ${formatInt(effect[0])})`;
      const config = GlyphEffects[effect[1]];
      const value = config.effect(this.glitchGlyphLevel, rarityToStrength(100));
      const effectTemplate = config.singleDesc;
      return effectTemplate.replace("{value}", config.formatEffect(value));
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Glitch Glyph Creation
    </template>
    <div class="c-reality-glyph-creation">
      <div>
        Create a level {{ formatInt(glitchGlyphLevel) }} Glitch Glyph.
        Rarity will always be {{ formatPercents(1.5) }} and
        level scales on your current Glitch Resource amount (not consumed). Glitch Glyphs have unique effects,
        some of which are only available with higher level Glyphs.
        Glitch Glyphs can also be sacrificed to increase all Chaos Dimension multipliers. Like Effarig and Reality Glyphs,
        you cannot equip more than one at the same time.
      </div>
      <div class="o-available-effects-container">
        <div class="o-available-effects">
          Available Effects:
        </div>
        <div
          v-for="(effect, index) in possibleEffects"
          :key="index"
        >
          {{ formatGlyphEffect(effect) }}
        </div>
      </div>
      <PrimaryButton
        v-if="glitchGlyphLevel !== 70000"
        @click="createGlitchGlyph"
      >
        Create a Glitch Glyph!
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="false"
      >
        Glitch Glyph level must be higher than {{ formatInt(0) }}
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-available-effects-container {
  margin: 1.5rem 0 2rem;
}

.o-available-effects {
  font-weight: bold;
}
</style>
