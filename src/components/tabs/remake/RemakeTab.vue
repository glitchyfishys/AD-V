<script>
import PrimaryButton from "@/components/PrimaryButton";
import RemakeUpgrade from "./RemakeUpgrade";

export default {
  name: "RemakeTab",
  components: {
    PrimaryButton,
    RemakeUpgrade,
  },

  data() {
    return {
      challengersEssence: new Decimal(),
      fullCompleation: false
    };
  },
  computed: {
    Upgrades: () => ChallengerUpgrades.all,
    HardUpgrades: () => GlitchRealityUpgrade(16).isBought ? HardChallengerUpgrades.all : [],
    Text: () => {
      if (Pelle.joined) return "Your Reality is enhanced by your Doomed one";
      if (ChallengerUpgrades.allBought) return "Conjoin your Reality with your Doomed Reaity";
      return "Require move power";
    },
  },
  methods: {
    update() {
      this.challengersEssence.copyFrom(Currency.challengersEssence);
      this.fullCompleation = GlitchRifts.gamma.milestones[5].effectOrDefault(0) != 0;
    },
    id(row, column) {
      return (row - 1) * 4 + column - 1;
    },
    tryComplete(){
      if (this.challengersEssence.lt(1)) return;

      let unlocked = false;
      preInfinityUGs.all.forEach(x => {
        if(!x.isBought && !unlocked) {
          player.glitch.preinfinity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      breakInfinityUGs.all.forEach(x => {
        if(!x.isBought && !unlocked) {
          player.glitch.breakinfinity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      eternityUGs.all.forEach(x => {
        if(!x.isBought && !unlocked) {
          player.glitch.eternity.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        }

      });

      realityUGs.all.forEach(x => {
        if(!x.isBought && !unlocked) {
          player.glitch.reality.upgradebits |= 1 << x.id;
          GameUI.notify.success("unlocked " + x.name);
          unlocked = true;
        } 
      });

      if (unlocked) Currency.challengersEssence.subtract(1);
    },
    Conjoin(){
      if (ChallengerUpgrades.allBought) {
        player.celestials.pelle.joined = true;
        Pelle.quotes.pellesChallenger.show();
      }
    }
  },
};
</script>

<template>
  <div style="font-size: 1.5rem;">
    <div
    v-if="!fullCompleation">
    You have failed to complete my challenges... However, I will give you another chance. <br>
    By using Challengers Essence you can complete them. (first to last) <br>
    </div>

    Completing a Doomed Reality grants Challengers Essence. <br>

    You have <span class="o-ChalEss">{{ format(challengersEssence,2,2) }}</span> Challengers Essence <br><br>

    
    <primary-button
    v-if="!fullCompleation"
    @click="tryComplete"
    >
      Complete one of Glitch's Challenges
    </primary-button>
    <div v-else class="flexing">
      <div 
      v-for="UG in Upgrades"
      >
      <RemakeUpgrade
      :upgrade="UG"
      :key="UG.id"
      />
      </div>

      <PrimaryButton class="pelle-button"
      @click="Conjoin"
      >
        {{Text}}
      </PrimaryButton> 

      <div 
      v-for="UG in HardUpgrades"
      >
      <RemakeUpgrade
      :upgrade="UG"
      :key="UG.id"
      />
      </div>
    </div>
    
   
  </div>
</template>

<style scoped>

.pelle-button {
  width: 100%;
  height: 6rem;
  margin: 2rem;
}

.flexing {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.c-glitch-upgrade-infotext {
  color: var(--color-text);
  margin: 1.5rem 0 1.5rem;
}

.o-ChalEss{
  color: cyan;
  font-size: 2rem;
}
  
</style>
