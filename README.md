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


