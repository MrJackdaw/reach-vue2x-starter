# Reach + Vue2x starter

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## What is it? 

Inspired by [@zetsuboii's starter pack](https://github.com/Zetsuboii/reach-react-starter), and based on my initial template for a [ReactJS DApp](). 
This is a quick scaffold/template for building a `Vue2x` and `Reach Lang` DApp. 

## What does it contain? 

* [Vue 2](https://cli.vuejs.org/guide/creating-a-project.html#vue-create): A popular front-end framework for building web applications 
* [Reach Lang](https://docs.reach.sh/): A compiled language for building multi-chain smart contracts. This template includes **the JS dependency**, and [not the CLI](#installing-the-reach-cli).
* A [**BONUS** tool](#bonus-global-dapp-state) for managing your global application state.

Like the ReactJS version, this includes support for SASS and [Google's Material Icons](https://fonts.google.com/icons). There are no pre-defined styles, and you may `npm install` any additional dependencies.


## How do I use it?

1. Clone the project
2. `cd path/to/my-project`
3. `npm install` 
4. `npm run serve` (and view project at `localhost:8080`)

### Installing the Reach CLI

The scaffold doesn't include the `reach-sh` cli, so (if you don't already have that globally) you will need to install that. If you are using a linux based system, I recommend you `cd` into a directory in your `$PATH` variable (e.g. `/usr/local/bin/`) and follow Reach-sh's instructions to install the CLI there. This should allow you to run 

```
$: reach < command >
```

from any terminal instance, although you will have to go back in there to update it. 


## BONUS: Global DApp State 

This scaffold uses a custom application state object in place of Redux. It has a familiar API (`getState` and `subscribe`) since it is also based on the Redux core. It is based on a [single file](https://gist.github.com/MrJackdaw/ceca2b05743932513a6320f3f9eeea36#file-application-state-js) (which you can find in `./src/state/`). If you don't want to use the file, just remove the `./src/state/` folder.


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
```typescript
...
import myState from "./path/to/my-state.js";


class MyComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = myState.getState();
        this.unsubscribe = myState.subscribe(this.onGlobalState);
    }

    /** Stop listening to global state events */
    componentWillUnmount(){
        this.unsubscribe(); 
    }  

    /** EXAMPLE Custom method for responding to state updates */
    onGlobalState = (updatedState: object, updatedKeys: string[]) => {
        // e.g. if (updatedKeys.includes("username")) ... 
    }

    /** EXAMPLE Custom method for updating state */
    updateActions(newActions: number[]) {
        // Copy current global state and update with new items
        const { actions } = myState.getState();
        return myState.actions([ ...actions, ...newActions ])
    }  
}
```



