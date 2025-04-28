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
      ug: {bought: false, isAfordable: false, corrupt: false, corrupted: false},
    };
  },
  computed: {
    symbol: () => Null.symbol,
    isDoomed: () => Pelle.isDoomed,
    classList(){
      if(this.ug.corrupt){
        return {
         "c-null-button-bought-corrupt": this.ug.bought,
         "c-null-button-buyable-corrupt": this.ug.isAfordable && !this.ug.bought,
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
      this.ug.corrupt = this.upgrade.config.corrupt;
      this.ug.isAfordable = this.ug.corrupt ? Currency.corruptMatter.gte(this.upgrade.config.cost) : Currency.abyssalMatter.gte(this.upgrade.config.cost);
      this.ug.corrupted = Null.isCorrupt;
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
  v-if='(ug.corrupt && ug.corrupted) || !ug.corrupt'
  >
    <DescriptionDisplay :config='upgrade.config' />
    <div >
      <CostDisplay
      :config='upgrade.config'
      br
      :name='ug.corrupt ? "Corrupt Matter" : "Abyssal Matter"'
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
  background: #313131;
  color: var(--text-color);
}

.c-null-button-buyable {
  background: #33334b;
}

.c-null-button-bought {
  background: var(--color-null--base);
}

.c-null-button-buyable-corrupt {
  background: #433356;
}

.c-null-button-bought-corrupt {
  background: var(--color-null--corrupt);
}

</style>
