<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "LaitelaRunButton",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
      bestSet: [],
      tierNotCompleted: true,
    };
  },
  computed: {
    sName(){
      if(player.options.themeModern == "S15") return "Teresa-Lai'tela's";
      if(player.options.themeModern == "S16") return "Effarig-Lai'tela's";
      if(player.options.themeModern == "S17") return `The Nameless Lai'tela's`;
      if(player.options.themeModern == "S14") return "Ra-Lai'tela's";
      if(player.options.themeModern == "S19") return `Pelle-Lai'tela's`;
      if(player.options.themeModern == "S13") return "V-Lai'tela's";
      return "Lai'tela's";
    },
    sCel(){
      if(player.options.themeModern == "S15") return "Teresa-Lai'tela";
      if(player.options.themeModern == "S16") return "Effarig-Lai'tela";
      if(player.options.themeModern == "S17") return `The Nameless Lai'tela`;
      if(player.options.themeModern == "S14") return "Ra-Lai'tela";
      if(player.options.themeModern == "S19") return `Pelle-Lai'tela`;
      if(player.options.themeModern == "S13") return "V-Lai'tela";
      return "Lai'tela";
    },
    completionTime() {
      if (this.tierNotCompleted) return "Not completed at this tier";
      return `Fastest Completion: ${TimeSpan.fromSeconds(this.realityTime).toStringShort()}`;
    },
    runEffects() {
      return GameDatabase.celestials.descriptions[5].effects().split("\n");
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description();
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.realityTime = Time.laitelaFastestCompletion.totalMilliseconds;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
      this.bestSet = Glyphs.copyForRecords(player.records.bestReality.laitelaSet);
      this.tierNotCompleted = this.realityTime.eq(3600) || (this.realityTime.eq(300) && this.maxDimTier < 8);
    },
    startRun() {
      if (this.isDoomed) return;

      if ((!realityUGs.all[11].config.hasFailed() && !realityUGs.all[11].isBought) && player.options.confirmations.glitchCL){
        Modal.message.show(`you will fail glitch challenge ${realityUGs.all[11].config.name} <br> which is to ${realityUGs.all[11].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
        return;
      }
      else if((!realityUGs.all[12].config.hasFailed() && !realityUGs.all[12].isBought) && player.options.confirmations.glitchCL && Laitela.difficultyTier == 2){
        Modal.message.show(`you will fail glitch challenge ${realityUGs.all[12].config.name} <br> which is to ${realityUGs.all[12].config.requirement()} <br> you can disable this for <i>all</i> challenges in confirmations`);
        return;
      }

      Modal.celestials.show({ name: "Lai'tela's", number: 5 });
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <b>Start {{sName}} Reality</b>
    </span>
    <div
      :class="runButtonClassObject()"
      @click="startRun"
    />
    <div v-if="realityReward > 1">
      <b>
        All Dark Matter multipliers are {{ formatX(realityReward, 2, 2) }} higher.
      </b>
      <span v-if="maxDimTier > 0">
        <br><br>
        {{ completionTime }}
        <br>
        <span v-if="maxDimTier <= 7">
          <b>Highest active dimension: {{ formatInt(maxDimTier) }}</b>
        </span>
        <br><br>
        Glyph Set:
        <GlyphSetPreview
          text="Fastest Destabilization Glyph Set"
          :text-hidden="true"
          :force-name-color="false"
          :glyphs="bestSet"
        />
      </span>
      <span v-else>
        <br>
        <b>
          You also gain an additional {{ formatX(8) }} Dark Energy.
        </b>
        <br><br>
        {{ sName }} Reality has been fully destabilized and cannot have its reward further improved.
      </span>
      <br>
    </div>
    <div
      v-for="(line, lineId) in runEffects"
      :key="lineId + '-laitela-run-desc' + maxDimTier"
    >
      {{ line }} <br>
    </div>
    <br>
    <div>{{ runDescription }}</div>
  </button>
</template>
