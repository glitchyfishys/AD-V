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
      glitchGlyphLevel: new Decimal(),
      // This contains an array where each entry is an array looking like [4000, "glitchpow"]
      possibleEffects: [],
    };
  },
  methods: {
    update() {
      this.glitchGlyphLevel.copyFrom(AlchemyResource.glitch.amount);
      const glitchEffectConfigs = GlyphEffects.all.filter(eff => eff.glyphTypes[0]?.() == "glitch");
      const minGlitchEffectIndex = glitchEffectConfigs.map(cfg => cfg.intID).nMin();
      this.possibleEffects = glitchEffectConfigs
        .map(cfg => [glitchGlyphEffectLevelThresholds[cfg.intID - minGlitchEffectIndex], cfg.id]);
    },
    createGlitchGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show("No available inventory space; Sacrifice some Glyphs to free up space.",
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.glitchGlyph());
      player.reality.glyphs.createdGlitchGlyph = true;
      Achievement(194).unlock();
      this.emitClose();
    },
    formatGlyphEffect(effect) {
      if (this.glitchGlyphLevel.lt(effect[0])) return `(Requires Glyph level ${format(effect[0])})`;
      const config = GlyphEffects[effect[1]];
      const value = config.effect(this.glitchGlyphLevel, rarityToStrength(250));
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
        Rarity will always be {{ formatPercents(2.5) }} and
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
