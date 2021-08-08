<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <h2>Vue2x + Reach Starter - <code>Home.vue</code></h2>

    <p>
      This is an app scaffold for <b>Vue 2</b> and <b>Reach</b>. It allows you
      to quickly get started on a Vue2x DApp.
    </p>

    <hr />

    <h4>Global App State</h4>

    <p>
      This application comes with a global state instance. The state has a
      <b><code>globalCount</code></b> property, which is demonstrated below. Use
      the <b>Global Count</b> button in the <code>HelloWorld</code> component
      above to update the value globally, and use the router to see it reflected
      on any other subscribed component or page.
    </p>

    <p><b>Global Count:</b> {{ count }}</p>

    <p>
      <button @click.prevent="incGlobalCount"><b>Global Count++</b></button>
    </p>

    <button @click.prevent="resetAppStore">Reset State</button>
  </div>
</template>

<script>
// @ is an alias to /src
import AppStore, { incGlobalCount } from "../state";

export default {
  name: "Home",

  data: () => ({ count: 0, unsubscribe: null }),

  mounted() {
    this.unsubscribe = AppStore.subscribe(this.onAppState);
    this.onAppState(AppStore.getState());
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
