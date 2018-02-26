# React Recipes

[This repository](https://github.com/danburzo/react-recipes/) contains some tried-and-testes ways to work with React, documented [as I figure them out](https://github.com/danburzo/as-we-learn).

## Prerequisites

These articles assume _some_ prior knowledge of React, and that you use [JSX](https://reactjs.org/docs/introducing-jsx.html) and ES6 syntax, for which you'll need a tool like [Babel](https://babeljs.io) to transform your code into something that browsers can understand. 

## Table of contents

### Component basics

[__Ways to define components__](./recipes/components.md) walks you through the pros and cons of functional vs. class-based React components.

[__`React.PureComponent` caveats__](./recipes/purecomponent-caveats.md) shows you some scenarios where you're better off not using `PureComponent`.

[__The Component lifecycle__](./recipes/lifecycle.md) describes the methods available on a component, when they're called and what to do with each of them.

[__Use the best `setState` style for the job__](./recipes/set-state.md) when updating your component's state. 

[__Storing derived data__](./recipes/derived-data.md) shows you how to store additional data on your component.

[__Ways to use `defaultProps`__](./recipes/defaultprops.md) to make your code clearer. 

### Events

[__The `property` pattern for callbacks__](./recipes/property-pattern.md) helps you handle events more elegantly. 

[__Handling events outside the component__](./recipes/outside-events.md), React-style.

### Composition

[__Passing React components via props__](./recipes/passing-components.md) outlines some component composition strategies.

[__Passing props to `this.props.children`__](./recipes/children-props.md) using `React.Children.map` and `React.cloneElement`.

## Further reading

[The official React website](https://reactjs.org/) has comprehensive guides, tutorials, and links to useful tools. Spend an afternoon reading the guides cover to cover and you'll get a much firmer grasp on how to use React efficiently.

Other React pattern repositories:

* [reactpatterns.com](http://reactpatterns.com/)
* [react-in-patterns](https://github.com/krasimir/react-in-patterns)
* [react-playbook](https://github.com/kylpo/react-playbook)
