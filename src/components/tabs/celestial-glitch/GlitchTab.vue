<script>
import BlackHoleChargingSliders from "@/components/tabs/black-hole/BlackHoleChargingSliders";
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import GlitchRunButton from "./panel";
import GlitchUpgrade from "./GlitchUpgrade";

export default {
  name: "GlitchTab",
  components: {
    CelestialQuoteHistory,
    PrimaryButton,
    PrimaryToggleButton,
    BlackHoleChargingSliders,
    GlitchRunButton,
    GlitchUpgrade,
  },
  computed: {
    runEffects() {
      return GameDatabase.celestials.descriptions[6].effects().split("\n");
    },
    runDescription() {
      if(this.augments == "") return "Nothing";
      return this.augments;
    },
    collapseIcon() {
      return this.collapsedPower
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    isDoomed: () => glitch.isDoomed,
    upgradesPower: () => GlitchRealityUpgrades.all,
    upgradesSpeed: () => GlitchSpeedUpgrades.all,
  },

  data() {
    return {
      isRunning: false,
      quote: "",
      bits: 0,
      augments: makeEnumeration(Glitch.activeAugments),
      riftForce: "RIP",
      collapsedPower: false,
      collapsedSpeed: false,
      completions: 0,
    };
  },
  methods: {
    update() {
      this.completions = player.records.fullGameCompletions;
      this.collapsedPower = player.celestials.glitch.collapsed.forpower;
      this.collapsedSpeed = player.celestials.glitch.collapsed.forspeed;
      this.isRunning = Glitch.isRunning;
      this.quote = Glitch.quote;
      this.bits = Glitch.augmentEffectBits;
      this.augments = makeEnumeration(Glitch.activeAugments);
      this.riftForce = format(Currency.riftForce.value,2);
    },
    sName(){
      if(player.options.themeModern == "S15") return "Teresa-Glitch's";
      if(player.options.themeModern == "S16") return "Effarig-Glitch's";
      if(player.options.themeModern == "S17") return `The Nameless Glitch's`;
      if(player.options.themeModern == "S14") return "Ra-Glitch's";
      if(player.options.themeModern == "S13") return "V-Glitch's";
      return "Glitch's";
    },
    sCel(){
      if(player.options.themeModern == "S15") return "Teresa-Glitch";
      if(player.options.themeModern == "S16") return "Effarig-Glitch";
      if(player.options.themeModern == "S17") return `The Nameless Glitch`;
      if(player.options.themeModern == "S14") return "Ra-Glitch";
      if(player.options.themeModern == "S13") return "V-Glitch";
      return "Glitch";
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Glitch's", number: 6 });
    },
    effects(id){
      if(this.isRunning) return false;
      if ((player.celestials.glitch.augment.effectbits & (1 << id)) > 0) player.celestials.glitch.augment.effectbits &= ~(1 << id);
      else player.celestials.glitch.augment.effectbits |= (1 << id);
    },
    activeaugment(id){
      return Glitch.augmentEffectActive(id, true);
    },
    effectname(id){
      return Glitch.augmentEffects(id);
    },
    id(row, column) {
      return (row - 1) * 4 + column - 1;
    },
    toggleCollapsePower() {
      player.celestials.glitch.collapsed.forpower = !this.collapsedPower;
    },
    toggleCollapseSpeed() {
      player.celestials.glitch.collapsed.forspeed = !this.collapsedSpeed;
    },
    toggletoshow(){
      var toggles = 9; //base
      if(GlitchSpeedUpgrades.all[0].isBought) toggles++;
      return toggles;
    },
  },
};
</script>

<template>
  <div class="l-glitch-celestial-tab">
   this is a work in progress

    <div class="c-glitch-compact-top">
      <div>
        <p>you have <span class="o-riftForce">{{ riftForce}}</span> RiftForce </p>
        
        <CelestialQuoteHistory celestial="glitch"/>
        <GlitchRunButton />
      </div>
      <div>
      <PrimaryButton
        v-for="x in toggletoshow()"
        :key="x"
        class="o-primary-btn--subtab-option  o-reality-effect"
        @click="effects(x-1)">
        
        <p v-if="activeaugment(x-1)">
          remove {{effectname(x-1)}}
        </p>
        <p v-else>
          enable {{effectname(x-1)}}
        </p>
        
      </PrimaryButton>
  
        <br>
        you have {{runDescription}} active
      </div>

    </div>
      
    <BlackHoleChargingSliders />

      <div class="l-glitch-panel-container">
        <div class="c-glitch-panel-title">
          <i
            :class="collapsedPower ? 'fas fa-expand-arrows-alt' : 'fas fa-compress-arrows-alt'"
            class="c-collapse-icon-clickable"
            @click="toggleCollapsePower"
          />
          {{sName()}} layer one upgrades (power)
        </div>
      <div
        v-if="!collapsedPower"
        class="l-glitch-content-container"
      >
        
          <div class="l-reality-upgrade-grid">
            <div class="c-glitch-upgrade-infotext">
            the first 4 are repeatable, the others are like reality upgrades but can't be locked
          </div>
      
          <div
          v-for="row in 4"
          :key="row"
          class="l-reality-upgrade-grid__row">
            
          <GlitchUpgrade
            v-for="column in 4"
            :key="id(row, column)"
            :upgrade="upgradesPower[id(row, column)]"/>
          </div>
      
          </div>
          
        </div>
      </div>

    <div
      v-if="completions > 0"
      class="l-glitch-panel-container">
        <div class="c-glitch-panel-title">
          <i
            :class="collapsedSpeed ? 'fas fa-expand-arrows-alt' : 'fas fa-compress-arrows-alt'"
            class="c-collapse-icon-clickable"
            @click="toggleCollapseSpeed"
          />
          {{sName()}} layer two upgrades (speed)
        </div>
      <div
        v-if="!collapsedSpeed"
        class="l-glitch-content-container"
      >
        
          <div class="l-reality-upgrade-grid">
            <div class="c-glitch-upgrade-infotext">
            
          </div>
      
          <div
          v-for="row in 1"
          :key="row"
          class="l-reality-upgrade-grid__row">
            
          <GlitchUpgrade
            v-for="column in 4"
            :key="id(row, column)"
            :upgrade="upgradesSpeed[id(row, column)]"/>
          </div>
      
          </div>
          
        </div>
      </div>
    
    </div>
</template>

<style scoped>

.l-glitch-tab {
  margin-top: 1rem;
}

.c-glitch-upgrade-infotext {
  color: var(--color-text);
  margin: 1.5rem 0 1.5rem;
}

.o-riftForce{
  color: lime;
  font-size: 2rem;
}

.o-reality-effect{
  width: 30%;
  height: auto;
  display: inline-grid;
  line-height: initial;
}

.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-glitch-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-glitch-compact-top {
  display: flex;
  flex-direction: row;
  align-items: center;
}
  
</style>
