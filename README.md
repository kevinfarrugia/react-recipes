# React Recipes

[This repository](https://github.com/danburzo/react-recipes/) contains some tried-and-testes ways to work with React, documented [as I figure them out](https://github.com/danburzo/as-we-learn).

These articles assume _some_ prior knowledge of React, and that you use [JSX](https://reactjs.org/docs/introducing-jsx.html) and ES6 features (such as classes and modules), for which you'll need a tool like [Babel](https://babeljs.io) to transform your code into something that browsers can understand — a bit more tooling around, but it makes the examples clearer.

It doesn't touch libraries you sometimes find in the same sentence with React, such as [Redux](https://redux.js.org), because you can built lots of things [without it](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).

It also doesn't cover React style (naming, indentation, et cetera). If that is your thing, feel free to peruse the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).

## Table of contents

### Life inside a component

This section is about how to build React components.

* [__Ways to define components__](./recipes/components.md) walks you through the pros and cons of functional vs. class-based React components.
* [__`React.PureComponent` caveats__](./recipes/purecomponent-caveats.md) shows you some scenarios where you're better off not using `PureComponent`.
* [__Why immutability is important__](./recipes/immutability.md) clarifies why you want to keep your data immutable when working with React.
* [__The Component lifecycle__](./recipes/lifecycle.md) describes the methods available on a component, when they're called and what to do with each of them.
* [__Use the best `setState` style for the job__](./recipes/set-state.md) when updating your component's state. 
* [__Storing derived data__](./recipes/derived-data.md) shows you how to store additional data on your component.
* [__Ways to use `defaultProps`__](./recipes/defaultprops.md) to make your code clearer. 

### The component and the outside world

This section discusses how our component can interact outside its boundaries.

* [__Handling events outside the component__](./recipes/outside-events.md) the React way with the help of a small library.
* [__Rendering things outside the component__](./recipes/portals.md) with React's concept of Portals.
* [__Embedding React components in an existing app__](./recipes/inserting-components.md) shows how to turn some parts of your app over to React.

### How components talk to each other

In this section we explore some patterns of communication between components, and how to combine them like Lego bricks to build up our app.

* [__The `property` pattern for callbacks__](./recipes/property-pattern.md) helps you handle events more elegantly. 
* [__Passing React components via props__](./recipes/passing-components.md) outlines some component composition strategies.
* [__Passing props to `this.props.children`__](./recipes/children-props.md) using `React.Children.map` and `React.cloneElement`.

### Performance

* [__An introduction to performance__](./recipes/performance.md)
* [__`why-did-you-update` is your best friend__](./recipes/why-did-you-update.md)
* [__Arrays as props__](./recipes/arrays-as-props.md) and some ways they can affect your performance, and what to do about it

## Further reading

[The official React website](https://reactjs.org/) has comprehensive guides, tutorials, and links to useful tools. Spend an afternoon reading the guides cover to cover and you'll get a much firmer grasp on how to use React efficiently.

Other React pattern repositories:

* [reactpatterns.com](http://reactpatterns.com/)
* [react-in-patterns](https://github.com/krasimir/react-in-patterns)
* [react-playbook](https://github.com/kylpo/react-playbook)
* [react-bits](https://github.com/vasanthk/react-bits)
