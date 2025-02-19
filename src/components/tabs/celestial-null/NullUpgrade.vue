<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "NullUpgrade",
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
    symbol: () => Null.symbol,
    isDoomed: () => Pelle.isDoomed,
    classList(){
      if(this.ug.chaos){
        return {
         "c-null-button-bought-chaos": this.ug.bought,
         "c-null-button-buyable-chaos": this.ug.isAfordable && !this.ug.bought,
         "c-null-button-unbought": !this.ug.bought && !this.ug.isAfordable,
         "c-null-button": true,
        }
      }
      return {
         "c-null-button-bought": this.ug.bought,
         "c-null-button-buyable": this.ug.isAfordable && !this.ug.bought,
         "c-null-button-unbought": !this.ug.bought && !this.ug.isAfordable,
         "c-null-button": true,
      }
    }
  },
  methods: {
    update() {
      this.ug.bought = this.upgrade.isUnlocked;
      this.ug.isAfordable = Currency.artificialMatter.gte(this.upgrade.config.cost);
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
      :name='"Artificial Matter"'
      />

      <EffectDisplay
      :config='upgrade.config'
      br
      />
    </div>
  </PrimaryButton>
</template>

<style scoped>
.c-null-button {
  height: 125px;
  width: 250px;
  margin: 5px;
  border-color: #1d4087;
  position: relative;
}

.c-null-button-unbought {
  background: #555555;
  color: var(--text-color);
}

.c-null-button-buyable {
  background: #ccccff;
}

.c-null-button-bought {
  background: var(--color-null--base);
}

.c-null-button-buyable-chaos {
  background: #ffcccc;
}

.c-null-button-bought-chaos {
  background: var(--color-null--chaos);
}

</style>
