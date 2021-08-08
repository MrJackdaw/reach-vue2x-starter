import createState from "./application-state";

/**
 * Global application store. The object should be your initial global state;
 * every key becomes a method on the new `AppStore` instance. Primary API below.
 *
 * @method `getState()`: Get current application state
 *
 * @method `subscribe( fn(updatedState, updatedKeys) )`: Subscribe to state changes.
 * `subscribe` takes a function that receives the updated state object, and a list
 * of state keys that were updated.
 *
 * @method `multiple( updates )`: Subscribe to state changes
 *
 * @method `<< propertyName >>`: update state's `<< propertyName >>` property. This
 * will notify all subscribers with the new state and a list of updated state keys.
 * Note that `<< propertyName >>` represents any key on the object passed into
 * `createState`.
 */
const AppStore = createState({
  // global application state goes here; add/remove as many properties as needed
  globalCount: 0,

  // Additional helper properties
  assets: [],
  error: null,
  loading: false,
  reachAcct: null,
  msg: null,
  user: null,
});

export default AppStore;

/**
 * EXAMPLE HELPER: increments `store.globalCount`. You can create helper
 * functions like these to read/write global state: you can even make them
 * composable! The sky is not even a limit.
 */
export function incGlobalCount() {
  const { globalCount } = AppStore.getState();
  return AppStore.globalCount(globalCount + 1);
}

/**
 * Get an object to set a global error object or message.
 * @param {string|object} error Application error
 * @returns {{ error }} Object for updating global state
 */
export function setError(error = null) {
  return { error };
}

/**
 * Get an object to update global loading state (and optionally display/clear loading message)
 * @param {boolean} loading Application Loading state
 * @param {string|null} msg Loading message for user
 * @returns {{ loading, msg }} Object for updating global state
 */
export function setLoading(loading = false, msg = null) {
  return { loading, msg };
}
