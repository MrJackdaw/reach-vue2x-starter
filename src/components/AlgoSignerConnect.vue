<template>
  <!-- Connection details -->
  <section class="connect column">
    <!-- Create connection/cohort -->
    <h3>
      Welcome! - <code><pre>AlgoSignerConnect.vue</pre></code>
    </h3>

    <!-- No AlgoSigner notice -->
    <div v-if="!hasAlgoSigner" class="algosigner-notice">
      <p class="list-item list-item--label error--text">
        <b>AlgoSigner</b> is not installed!
      </p>
      <p>
        <a
          href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm"
          target="_blank"
          rel="noopener noreferrer"
          ><b>AlgoSigner</b></a
        >
        is a non-custodial blockchain wallet. It allows you to interact with
        Algorand dApps, currently available on Chrome and Chrome-like (e.g.
        Brave) browsers.
      </p>
      <p>
        Please ensure the extension is installed and enabled, and that you are
        logged in.
      </p>
    </div>

    <!-- List of AlgoSigner accounts -->
    <template v-else-if="accountsList.length">
      <h3 class="h4 primary-light--text">Please select an account:</h3>

      <div
        class="list-item list-item--account"
        v-for="(a, i) in accountsList"
        @click.stop="loadAccountData(a)"
        :key="a.address"
      >
        <span class="index">{{ i + 1 }}</span>
        <span class="hash">{{ truncateAccountString(a.address) }}</span>
      </div>
    </template>

    <!-- "Connect" Button -->
    <button
      v-if="!accountsList.length"
      class="button outline primary-dark--text h6"
      @click.stop="connect"
    >
      <span class="material-icons">lock</span>
      <span>CONNECT ALGORAND WALLET</span>
    </button>

    <!-- Error message -->
    <p v-if="error">
      <b class="error--text">Error:&nbsp;</b>{{ error.message || error }}
    </p>
  </section>
</template>

<script>
import Reach, {
  AlgoSigner,
  connectToAlgorand,
  truncateAccountString,
} from "../reach";
import AppStore, { setError, setLoading } from "../state";
import API from "../network";

export default {
  name: "AlgoSignerConnect",

  data: () => ({
    accountsList: [],
    error: null,
    hasAlgoSigner: Boolean(AlgoSigner),
    msg: null,
    unsubscribe: null,
  }),

  mounted() {
    // Connect to Global App State
    this.unsubscribe = AppStore.subscribe(this.onAppState);

    // Check for AlgoSigner
    if (this.hasAlgoSigner) {
      // Set initial state and trigger AlgoSigner popup.
      return this.onAppState(AppStore.getState());
    }

    AppStore.error("You don't have AlgoSigner installed!");
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    /** Connect to Algorand using `AlgoSigner`, then fetch accounts and txns */
    async connect() {
      AppStore.multiple(setLoading(true, "Connecting AlgoSigner ..."));

      try {
        const accounts = await connectToAlgorand();

        switch (accounts.length) {
          case 0:
            throw new Error("You need at least one account to proceed!");
          case 1:
            return this.loadAccountData(accounts[0]);
          default:
            return (this.accountsList = accounts);
        }
      } catch (error) {
        return AppStore.multiple({
          ...setLoading(),
          ...setError(error.message || error),
        });
      }
    },

    /**
     * Load user's data (primary account, transactions) into Application state
     * @param {{ address: string }} data Wallet Address from AlgoSigner
     */
    async loadAccountData({ address: addr }) {
      // Start loading and show message
      AppStore.multiple(setLoading(true, "Loading Account Data ..."));

      // Connect account via Reach: fetch account assets (tokens)
      const [reachAcct, { assets: allAssets }] = await Promise.all([
        Reach.connectAccount({ addr, AlgoSigner }),
        API.getAccountByAddress(addr),
      ]);

      // Update global state (and fetch data for only non-zero assets)
      AppStore.multiple({
        ...setLoading(),
        ...setError(),
        assets: await Promise.all(allAssets.reduce(this.mergeAssets, [])),
        reachAcct,
        user: addr,
      });
    },

    /**
     * Helper: Fetch data for assets (FTs and NFTs) with a greater-than-zero balance
     * @param {object[]} all List of non-zero assets
     * @param {object} asset Current asset. If balance > 0, gets converted to a data-fetch promise.
     */
    mergeAssets(all, asset) {
      if (asset.amount > 0) all.push(API.getAssetById(asset["asset-id"]));
      return all;
    },

    /** Update local state with Application State */
    onAppState(state) {
      this.error = state.error;
      this.msg = state.msg;
    },

    /** UI Helper */
    truncateAccountString,
  },
};
</script>
