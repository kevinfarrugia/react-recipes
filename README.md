# react-recipes

[This repository](https://github.com/danburzo/react-recipes/) contains some tried-and-testes ways to work with React, documented [as I figure them out](https://github.com/danburzo/as-we-learn).

## Table of contents

### Component basics

[__Ways to define components__](./recipes/components.md) walks you through the pros and cons of functional vs. class-based React components.

[__`React.PureComponent` caveats__](./recipes/purecomponent-caveats.md) shows you some scenarios where you're better off not using `PureComponent`.

[__Use the best `setState` style for the job__](./recipes/set-state.md) when updating your component's state. 

[__Ways to use `defaultProps`__](./recipes/defaultprops.md) to make your code clearer. 

### Events

[__The `property` pattern for callbacks__](./recipes/property-pattern.md) helps you handle events more elegantly. 

[__Handling events outside the component__](./recipes/outside-events.md), React-style.

### Composition

[__Passing React components via props__](./recipes/passing-components.md) outlines some component composition strategies.

[__Passing props to `this.props.children`__](./recipes/children-props.md) using `React.Children.map` and `React.cloneElement`.

## Further reading

* [reactpatterns.com](http://reactpatterns.com/)
* [react-in-patterns](https://github.com/krasimir/react-in-patterns)
* [react-playbook](https://github.com/kylpo/react-playbook)
