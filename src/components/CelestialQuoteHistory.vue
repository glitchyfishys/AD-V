<script>
export default {
  name: "CelestialQuoteHistory",
  props: {
    celestial: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShown: false
    };
  },
  computed: {
    
    possessiveForm() {
    if(player.options.themeModern == "S15") return `Teresa's`;
    if(player.options.themeModern == "S16") return `Effarig's`;
      if(player.options.themeModern == "S17") return `The Nameless Ones'`;
    if(player.options.themeModern == "S13") return `V's`;
    if(player.options.themeModern == "S14") return `Ra's`;
    return this.celestial == "glitch" ? "Glitch" : Celestials[this.celestial].possessiveName;
    },
    color() {
      return `var(--color-${this.sCelestial()}--base)`;
    },
  },
  methods: {
    update() {
      this.isShown = Celestials[this.celestial].quotes.all.some(x => x.isUnlocked);
    },
    sCelestial(){
      if(player.options.themeModern == "S15") return `teresa`;
      if(player.options.themeModern == "S16") return `effarig`;
      if(player.options.themeModern == "S17") return `enslaved`;
      if(player.options.themeModern == "S14") return `ra`;
      if(player.options.themeModern == "S13") return `v`;
      return this.celestial;
    },
    show() {
      Quote.showHistory(Celestials[this.celestial].quotes.all);
    },
  }
};
</script>

<template>
  <button
    v-if="isShown"
    class="c-celestial-quote-history--button"
    :style="{
      '--scoped-cel-color': color
    }"
    @click="show"
  >
    {{ possessiveForm }} Quotes
  </button>
</template>

<style scope>
.c-celestial-quote-history--button {
  align-self: center;
  font-family: Typewriter;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid var(--scoped-cel-color);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  transition: 0.2s;
  transition-property: color, background-color;
  cursor: pointer;
}

.c-celestial-quote-history--button:hover {
  color: var(--color-text-inverted);
  background-color: var(--scoped-cel-color);
}
</style>
