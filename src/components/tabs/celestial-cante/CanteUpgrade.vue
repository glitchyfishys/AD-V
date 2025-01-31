<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CanteUpgrade",
  components: {
    CostDisplay,
    DescriptionDisplay,
    EffectDisplay,
    PrimaryButton
  },
  props: {
    upgrade:{
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      ug: {bought: false, isAfordable: false, purged: false, chaos: false,},
    };
  },
  computed: {
    symbol: () => Cante.symbol,
    isDoomed: () => Pelle.isDoomed,
    classList(){
      if(this.ug.chaos){
        return {
         "c-cante-button-bought-chaos": this.ug.bought,
         "c-cante-button-buyable-chaos": this.ug.isAfordable && !this.ug.bought,
         "c-cante-button-unbought": !this.ug.bought && !this.ug.isAfordable,
         "c-cante-button": true,
        }
      }
      return {
         "c-cante-button-bought": this.ug.bought,
         "c-cante-button-buyable": this.ug.isAfordable && !this.ug.bought,
         "c-cante-button-unbought": !this.ug.bought && !this.ug.isAfordable,
         "c-cante-button": true,
      }
    }
  },
  methods: {
    update() {
      this.ug.bought = this.upgrade.isUnlocked;
      this.ug.chaos = this.upgrade.config.chaos;
      this.ug.purged = Cante.purged;
      this.ug.isAfordable = this.ug.chaos ? Currency.chaosMatter.gte(this.upgrade.config.cost) : Currency.artificialMatter.gte(this.upgrade.config.cost);
    },
    buy(){
      this.upgrade.purchase();
    }
  }
};
</script>

<template>
  <PrimaryButton
  :class="classList"
  @click="buy"
  v-if='(ug.chaos && ug.purged) || !ug.chaos'
  >
    <DescriptionDisplay :config='upgrade.config' />
    <div >
      <CostDisplay
      :config='upgrade.config'
      br
      :name='ug.chaos ? "Chaotic Matter" : "Artificial Matter"'
      />

      <EffectDisplay
      :config='upgrade.config'
      br
      />
    </div>
  </PrimaryButton>
</template>

<style scoped>
.c-cante-button {
  height: 125px;
  width: 250px;
  margin: 5px;
  border-color: #1d4087;
  position: relative;
}

.c-cante-button-unbought {
  background: #555555;
  color: var(--text-color);
}

.c-cante-button-buyable {
  background: #ccccff;
}

.c-cante-button-bought {
  background: var(--color-cante--base);
}

.c-cante-button-buyable-chaos {
  background: #ffcccc;
}

.c-cante-button-bought-chaos {
  background: var(--color-cante--chaos);
}

</style>
