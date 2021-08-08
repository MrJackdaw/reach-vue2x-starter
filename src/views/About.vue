<template>
  <div class="about">
    <h1>About Page</h1>

    <p>
      This is an app scaffold for <b>Vue 2</b> and <b>Reach</b>. It allows you
      to quickly get started on a Vue2x DApp.
    </p>

    <hr />

    <template v-if="!connected">
      <h4>Connect your account!</h4>
      <p>
        Below, you will find a demo for
        <b>
          <code><pre>AlgoSignerConnect.vue</pre></code>
        </b>
        Take a look at the code to see how it works, and feel free to add styles
        to your liking.
      </p>

      <p>
        <b>Note</b>: this project supports SASS, and includes Google's
        <b>Material Icons</b> via a <code>&lt;link&gt;</code> element in
        <code>index.html</code>.
      </p>

      The algosigner component is below the <code>&lt;hr&gt;</code> element
      below.

      <hr />

      <algo-signer-connect />
    </template>

    <section v-else>
      <h4>Connected!</h4>

      <p>
        If you are seeing this message, you have successfully authenticated with
        <b>AlgoSigner</b>, and are ready to use your account with <b>Reach</b>.
      </p>

      <p><b>Connected account:</b> {{ user }}</p>
    </section>
  </div>
</template>

<script>
import AlgoSignerConnect from "../components/AlgoSignerConnect.vue";
import { truncateAccountString } from "../reach";
import AppStore from "../state";

export default {
  name: "About",

  components: { AlgoSignerConnect },

  data: () => ({ connected: false, user: null, unsubscribe: null }),

  mounted() {
    // Subscribe to global application state
    this.unsubscribe = AppStore.subscribe(this.onAppState);

    // initialize component state
    this.onAppState(AppStore.getState());
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    /**
     * Update local state when app state changes
     * @param {{[x:string]: any }} state updated global state
     * @param {string[]} keys List of keys updated by state
     */
    onAppState(state /* , keys */) {
      this.connected = Boolean(state.user);
      this.user = state.user && truncateAccountString(state.user);
    },
  },
};
</script>
