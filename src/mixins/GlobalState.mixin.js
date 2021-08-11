import AppStore from "../state";

/**
 * This mixin automatically subscribes/unsubscribes a Vue Component to the global
 * application state. It gives dependants a `store` property, which is an object containing
 * a subsection of the global state, and an `unsubscribe` function to detach from state
 * changes.
 *
 * Any implementing component must supply a `stateKeys` array, which contains a list of state
 * keys that can be used for component data. The component will react to global state updates
 * when one of those keys changes. If the property is not present, the `mixin` will throw an
 * error.
 *
 * Any key in the `stateKeys` array will become a property
 */
const GlobalStateMixin = {
  data() {
    return { unsubscribe: null, store: {} };
  },

  created() {
    // Enforce dependant component requirements
    if (!Array.isArray(this.stateKeys)) {
      const msg = `
      "GlobalStateMixin" requires a computed or static property called "stateKeys". It should be a list/array of keys (strings) on the global state instance" that you want to use in this component.`;

      throw new Error(msg);
    }

    if (this.stateKeys.length === 0) {
      const msg = `
      "GlobalStateMixin" requires at least one key on the global state instance" to be used in this component.`;

      throw new Error(msg);
    }
  },

  mounted() {
    /* Subscribe to global app state and set initial component state */
    this.unsubscribe = AppStore.subscribe(this.onAppState);
    this.onAppState(AppStore.getState(), this.stateKeys);
  },

  beforeUnmount() {
    /* Unsubscribe from global app state */
    this.unsubscribe();
  },

  methods: {
    /**
     * Update component's local state with data from global state
     * @param {{[x:string]: any}} state Global App State
     * @param {string[]} updatedKeys List of keys that were just updated
     */
    onAppState(state, updatedKeys) {
      // Only update with values that this component cares about.
      const updates = updatedKeys.reduce((agg, key) => {
        if (this.stateKeys.includes(key)) agg[key] = state[key];
        return agg;
      }, {});

      // Update object reference so dependant UI can refresh
      this.store = { ...this.store, ...updates };
    },
  },
};

export default GlobalStateMixin;
