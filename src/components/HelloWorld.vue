<template>
  <section class="hello-world">
    <h1>
      <code><pre>HelloWorld.vue</pre></code>
    </h1>

    <p>
      <a href="https://vuejs.org" target="_blank">Vue 2 Documentation</a>
    </p>

    <p>
      This component is attached to the application state. Click the
      <b>Global Count</b> button to update the application's
      <b><code>globalCount</code></b> property.
    </p>

    <button type="button" @click="count++">
      <b>Component count</b> is: {{ count }}
    </button>

    <button type="button" @click="incGlobalCount">
      <b>Global count</b> is: {{ store.globalCount }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to see how the
      <code>ApplicationStore</code> is handled, and to test hot module
      replacement.
    </p>
  </section>
</template>

<script setup>
import { incGlobalCount } from "../state";
import GlobalStateMixin from "../mixins/GlobalState.mixin";

export default {
  name: "HelloWorld",

  mixins: [GlobalStateMixin],

  props: { msg: String },

  data: () => ({
    // Local component counter
    count: 0,

    // A list of keys we want to watch (see src/state/index)
    stateKeys: ["globalCount"],
  }),

  methods: {
    incGlobalCount,
  },
};
</script>

<style scoped>
a {
  color: #42b983;
}

.hello-world {
  border: 1px solid;
  margin: 2rem 0;
}
</style>
