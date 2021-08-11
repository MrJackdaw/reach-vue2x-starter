# BONUS: Global DApp State 

This scaffold uses a custom application state object in place of Redux. It has a familiar API (`getState` and `subscribe`) since it is also based on the Redux core. It is based on a [single file](https://gist.github.com/MrJackdaw/ceca2b05743932513a6320f3f9eeea36#file-application-state-js) (which you can find in `./src/state/`). If you don't want to use the file, just remove the `./src/state/` folder.

## Usage

Aside from a few extra functions, it is much simpler to use: 

### i. State instance

> **Hint**: In this scaffold, the state instance is in `state/index.js`: you can just
> add any keys you need to the `createState` argument in that file.

```javascript
import createState from "path/to/application-state.js"

// Create a state instance with multiple properties. Every
// property name becomes an update method on the instance.
const myState = createState({ actions: [], ... });

// update a single key:
myState.actions([1, 2, 3]);

// update multiple keys:
myState.multiple({ actions: [1, 2, 3], ... });

// reset all keys (does not remove subscribers)
myState.reset();
```

### ii. Usage
You can import and use your state in any component without passing it through 
components (unless you really want to):

#### Component Example
```typescript
// MyComponent.vue
...
import myState from "./path/to/my-state.js";


export default {
    name: "MyComponent",

    data: => ({ store: {}, unsubscribe: null })

    mounted() {
        this.store = myState.getState();
        this.unsubscribe = myState.subscribe(this.onGlobalState);
    },

    /** Stop listening to global state events */
    beforeUnmount() {
        this.unsubscribe();
    },
    
    methods: {
        /** 
         * EXAMPLE Custom method for responding to state updates. This function will
         * get triggered whenever the state is updated (e.g. myState.multiple( ... ))
         */
        onGlobalState = (updatedState: object, updatedKeys: string[]) => {
            // You can use the "updatedKeys" array to determine whether to update
            // e.g. if (updatedKeys.includes("actions")) ... 
            this.store = { ...updatedState };
        }

        /** 
         * EXAMPLE Custom method for updating state. You can hook a UI component
         * into this function (e.g. a button) to trigger the state update.
         */
        updateActions(newActions: number[]) {
            // Copy current global state and update with new items
            const { actions } = myState.getState();
            return myState.actions([ ...actions, ...newActions ])
        }
    }
}
```


## Simplify with mixins
I don't know aboubt you, but I'd be *pissed* if I had to write that stuff over and over again. Luckily, this template includes a `GlobalStateMixin` (see `./src/mixins/GlobalState.mixin.js`) that abstracts this stuff for you. Remember the [component example above](#component-example) above?

### Modified Example with Mixins
```typescript
// MyComponent.vue
...
// REPLACE (import myState from "./path/to/my-state.js";) WITH:
import GlobalStateMixin from "../mixins/GlobalState.mixin";


export default {
    name: "MyComponent",

    mixins: [GlobalStateMixin],

    // "stateKeys" tells the mixin what part of the global state should trigger a component update.
    // It can be computed or static, but it must be in the component. In this example, the 
    // component will update when "globalState.actions" is changed.
    // 
    // The "unsubscribe" and "store" properties will come from/be managed by the mixin, so they
    // aren't specified here. 
    data: => ({ stateKeys: ["actions"] }),

    methods: {
        /** 
         * EXAMPLE Custom method for updating state. You can hook a UI component
         * into this function (e.g. a button) to trigger the state update.
         */
        updateActions(newActions: number[]) {
            // Copy current global state and update with new items
            const { actions } = myState.getState();
            return myState.actions([ ...actions, ...newActions ])
        }
    }
}
```

You can go a step further and implement an App-level mixin, but note that too many state subscribers may impact the performance of your app (whenever the global state is updated).


