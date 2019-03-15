# React Recipes

__Updated for: React 16.3__

[This repository](https://github.com/danburzo/react-recipes/) contains some tried-and-tested ways to work with React, along with in-depth explanations of how certain aspects of the library work.

It assumes _some_ prior knowledge of React (hopefully I'll be able to include introductory articles at some point), and that you use [JSX](https://reactjs.org/docs/introducing-jsx.html) and Fancy Javascript, such as classes and modules. These features require a bit of initial setup. Although they're _not actually necessary_, forgoing JSX and ES6 modules is a less-than-stellar development experience; instead, see [Setting up shop](./recipes/setting-up-shop.md) for a quick way to get started on a React project with all the goodness.

I try to stick to the plain React API. Some articles do however point to useful libraries and tools when they're easy to pick up on and don't introduce too many new concepts.

It rarely touches on React style such as naming, indentation, et cetera. You can enforce a consistent style in your project with [Prettier](https://prettier.io/), and supplement it with the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).

Finally, but most importantly, these articles [reflect my current understanding](https://github.com/danburzo/as-we-learn) of how React works. While I strive to get the clearest picture possible, some aspects may still be inaccurate, out of date, or generally Bad Ideas. Sorry about that — I'm trying my best. If you spot any errors or dubious claims, please let me know by filing an issue or a pull request.

## Table of contents

### Getting started

* [__Setting up shop__](./recipes/setting-up-shop.md) walks you through setting up a React project with JSX and Fancy JavaScript without losing your soul in the process.

### Mental models

* [__Reading JSX as if it were JavaScript__](./recipes/jsx-to-javascript.md)

### Life inside a component

This section is about how to build React components.

* [__Ways to define components__](./recipes/components.md) walks you through the pros and cons of functional vs. class-based React components.
* [__`React.PureComponent` caveats__](./recipes/purecomponent-caveats.md) shows you some scenarios where you're better off not using `PureComponent`.
* [__Why immutability is important__](./recipes/immutability.md) clarifies why you want to keep your data immutable when working with React.
* [__The Component lifecycle__](./recipes/lifecycle.md) describes the methods available on a component, when they're called and what to do with each of them.
* [__Use the best `setState` style for the job__](./recipes/set-state.md) when updating your component's state. 
* [__Ways to use `defaultProps`__](./recipes/defaultprops.md) to make your code clearer. 

### The component and the outside world

This section discusses how our component can interact outside its boundaries.

* [__Handling events outside the component__](./recipes/outside-events.md) the React way with the help of a small library.
* [__Rendering things outside the component__](./recipes/portals.md) with React's concept of Portals.
* [__Embedding React components in an existing app__](./recipes/inserting-components.md) shows how to turn some parts of your app over to React.

### How components talk to each other

In this section we explore some patterns of communication between components, and how to combine them like Lego bricks to build up our app.

* [__How components talk to each other__](./recipes/component-communication.md) is an intro to how React components compose.
* [__The `property` pattern for callbacks__](./recipes/property-pattern.md) helps you handle events more elegantly. 
* [__Passing React components via props__](./recipes/passing-components.md) outlines some component composition strategies.
* [__Passing props to `this.props.children`__](./recipes/children-props.md) using `React.Children.map` and `React.cloneElement`.
* [__The render prop pattern__](./recipes/render-prop-pattern.md)
* [__Error Boundaries__](./recipes/error-boundaries.md) will stop a component that crashed from breaking your whole app.

### Performance

* [__An introduction to performance__](./recipes/performance.md)
* [__`why-did-you-update` is your new best friend__](./recipes/why-did-you-update.md) that lets you know when your components are updating uselessly.
* [__Arrays as props__](./recipes/arrays-as-props.md) and some ways they can affect your performance, and what to do about it.

## Further reading

[The official React website](https://reactjs.org/) has comprehensive guides, tutorials, and links to useful tools. Spend an afternoon to a fortnight reading the guides cover to cover and you'll get a much firmer grasp on how to use React efficiently.

On his [Overreacted](https://overreacted.io/) blog, Dan Abramov goes on interesting deep-dives into how React works under the hood.

Then there are other React pattern repositories you might find interesting:

* [reactpatterns.com](http://reactpatterns.com/)
* [react-in-patterns](https://github.com/krasimir/react-in-patterns)
* [react-playbook](https://github.com/kylpo/react-playbook)
* [react-bits](https://github.com/vasanthk/react-bits)

Assorted articles from around the web:

* [React Tutorial: A Comprehensive Guide to learning React.js in 2018](https://tylermcginnis.com/reactjs-tutorial-a-comprehensive-guide-to-building-apps-with-react/) by Tyler McGinnis
