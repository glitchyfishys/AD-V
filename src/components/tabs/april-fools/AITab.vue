<script>

export default {
  name: "AITab",
  data() {
    return {
      user: []
    };
  },
  methods: {
    update() {
    },
    send() {
      const P = prompt("Prompt");
      if (P == "" || P == null) return;
      this.user.push(P);
    }
  }
};
</script>

<template>
  <div>
     YOU FOOLS
     <br>
      <div style="display: inline-flex; justify-content: center; height: 100%; width: 100%;">
        <div
        style="height: 100%; width: 100%;"
        v-if="user.length > 0"
        >
          <div
          style="border: 5px solid grey;"
          v-for="value in user"
          >
            <div
            style="border: 5px solid red; text-align: right; font-size: 2rem;"
            >
                {{ value }}
            </div>

            <div
            style="border: 5px solid green; text-align: left; font-size: 2rem;"
            > As an AI language modal I can't not help with that request.
            </div>
          </div>
        </div>
        

        <div
          style="border: 5px solid grey; height: 100%; width: 100%;"
          v-else
        ></div>
      </div>
        
        
        <br>
        <button
        @click="send"
        >
          Send Prompt
        </button>
  </div>
</template>

<style scoped>

</style>
