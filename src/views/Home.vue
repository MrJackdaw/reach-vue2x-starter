<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <HelloWorld msg="Welcome to Your Vue.js App" />

    <h2>Global Application State - <code>Home.vue</code></h2>

    <p>
      This application's global state instance has a
      <b><code>globalCount</code></b> property, which is shown below. The value
      will update when the state is changed. Use the <b>Global Count</b> button
      in the <code>HelloWorld</code> component above to change it.
    </p>

    <p><b>Global Count:</b> {{ count }}</p>

    <p>
      <button @click.prevent="incGlobalCount"><b>Global Count++</b></button>
    </p>

    <button @click.prevent="resetAppStore">Reset State</button>
    <algo-signer-connect />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import AppStore, { incGlobalCount } from "../state";
import AlgoSignerConnect from "@/components/AlgoSignerConnect.vue";

export default {
  name: "Home",
  components: {
    AlgoSignerConnect,
    HelloWorld,
  },

  data: () => ({ count: 0, unsubscribe: null }),

  mounted() {
    this.unsubscribe = AppStore.subscribe(this.onAppState);
  },

  beforeUnmount() {
    this.unsubscribe();
  },

  methods: {
    incGlobalCount,

    onAppState({ globalCount }) {
      this.count = globalCount;
    },

    resetAppStore() {
      return AppStore.reset();
    },
  },
};
</script>
