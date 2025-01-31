<script>
import GlitchEffect from "@/components/GlitchEffect.vue";
import CelestialQuoteBackground from "./CelestialQuoteBackground";

export default {
  name: "CelestialQuoteLine",
  components: {
    CelestialQuoteBackground,
    GlitchEffect
  },
  props: {
    quote: {
      type: Object,
      required: true
    },
    currentLine: {
      type: Number,
      required: true
    },
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    leftVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    rightVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    closeVisible: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data() {
    return {
      message: "",
      celestialSymbols: [],
      celestials: [],
      celestialName: "",
      tremble: false,
      displayed: true
    };
  },
  computed: {
    line() {
      let hidden = 0;
      for (let x=0; x <= Math.min(this.currentLine + hidden, this.quote.totalLines); x++){
        if(this.quote.line(x) == undefined) continue;
        if(!this.quote.line(x).isDisplayed) hidden++;
      }
      return this.quote.line(this.currentLine + hidden);
    },
    leftClass() {
      return {
        "c-modal-celestial-quote__arrow": true,
        "c-modal-celestial-quote__arrow-left": true,
        "c-modal-celestial-quote__arrow-invisible": !this.leftVisible,
        "fas": true,
        "fa-chevron-circle-left": true,
      };
    },
    rightClass() {
      return {
        "c-modal-celestial-quote__arrow": true,
        "c-modal-celestial-quote__arrow-right": true,
        "c-modal-celestial-quote__arrow-invisible": !this.rightVisible,
        "fas": true,
        "fa-chevron-circle-right": true,
      };
    },
  },
  methods: {
    update() {
      const line = this.line;
      this.celestialSymbols = line.celestialSymbols;
      this.message = line.line;
      this.celestials = line.celestials;
      this.celestialName = line.celestialName;
      this.tremble = line.tremble;
      this.displayed = line.displayed;
      this.glitched = line.glitched;
    },
    trembling(){
      if(!this.tremble) return {};

      const rand1 = (Math.random() - 0.5) *2;
      const rand2 = (Math.random() - 0.5) *2;

      return {
        left: `calc(50% + ${5 * rand1}px)`,
        top: `${5 * rand2}px`,
        transitionDuration: player.options.updateRate + "ms",
        transform: "translateX(-50%)",
        position: "absolute"
      };
    }
  },
};
</script>

<template>
  <CelestialQuoteBackground
    :celestial-symbols="celestialSymbols"
    :celestials="celestials"
    :primary="primary"
    :glitched="glitched"
    v-if="displayed"
  >
    <span
      v-if="line.showCelestialName"
      class="c-modal-celestial-name"
    >
      <GlitchEffect v-if="glitched">
        {{ celestialName }}  
      </GlitchEffect>
      <span v-else>
        {{ celestialName }}  
      </span>
    </span>

    <i
      :class="leftClass"
      @click="$emit('progress-in', 'left')"
    />

    <span class="l-modal-celestial-quote__text" :style="trembling() ">
      <GlitchEffect v-if="glitched">
        {{ message }}
      </GlitchEffect>
      <span v-else>
        {{ message }}
      </span>
      
    </span>

    <i
      :class="rightClass"
      @click="$emit('progress-in', 'right')"
    />
    <i
      class="c-modal-celestial-quote__end fas fa-check-circle"
      @click="emitClose"
    />
  </CelestialQuoteBackground>
</template>

<style scoped>
.c-modal-celestial-name {
  position: absolute;
  top: 1rem;
  right: 0;
  left: 0;
  font-weight: bold;
}

.c-modal-celestial-quote__arrow {
  font-size: 150%;
  margin: 0.5rem;
  cursor: pointer;
}

.c-modal-celestial-quote__arrow-left {
  position: absolute;
  left: 1rem;
}

.c-modal-celestial-quote__arrow-right {
  position: absolute;
  right: 1rem;
}

.c-modal-celestial-quote__end {
  position: absolute;
  bottom: 1.5rem;
  left: calc(50% - 1rem);
  font-size: 150%;
  cursor: pointer;
}

.l-modal-celestial-quote__text {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 75%;
  justify-content: center;
}

.l-modal-celestial-quote__buttons {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.c-modal-celestial-quote__arrow-invisible {
  visibility: hidden;
}
</style>
