<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import StdStoreRow from "@/components/modals/StdStoreRow";

export default {
  name: "StdStoreModal",
  components: {
    ModalWrapper,
    StdStoreRow
  },
  data() {
    return {
      macPurchaser: false,
    };
  },
};
</script>

<template>
  <ModalWrapper class="c-shop-modal">
    <template #header>
      Support The Developer - coins
    </template>
    <span v-if="macPurchaser">
      <button class="o-shop-button-button" >Confirm Purchase to Receive STDs</button>
      <br><span>(Required on Mac)</span><br>
    </span>
    <div class="l-modal-store-content">
      <img src="../../../public/images/std_coin.png">
      <div class="c-modal-store-buttons">
        <StdStoreRow
          :amount="30"
          :cost="2.99"
        />
        <StdStoreRow
          :amount="60"
          :cost="4.99"
        />
        <StdStoreRow
          :amount="140"
          :cost="9.99"
        />
        <StdStoreRow
          :amount="300"
          :cost="19.99"
        />
        <StdStoreRow
          :amount="1000"
          :cost="49.99"
        />
      </div>
    </div>
  </ModalWrapper>
</template>
