# Ways to define components

_Status: outdated_

_This article needs a rewrite. At the time, function components did not have many of the features available to class components. In the meantime, the `useState` and `useEffect` hooks were introduced, and `React.memo()` is equivalent to `React.PureComponent`._

All React components do one thing: based on some input that they get via `props` they return a piece of UI in the form of an element tree. Data that goes in gets baked into something you see on your screen.

A component can be:

- a plain function
- a `class` that extends `React.Component`

**Plain functions** take the set of props as their only parameter and return an element tree:

```jsx
const Button = props => <button>{props.label}</button>;
```

**Classes** that extend `React.Component` have their `render()` method called to return an element tree. They read the current props from the class instance's `this.props` property:

```jsx
class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

In terms of performance, we need to be mindful of how React decides to re-render components:

- plain functions are re-rendered every time
- classes extending `React.PureComponent` only re-render when their props or state change
- classes extending `React.Component` re-render every time by default, but this can be controlled by implementing the `shouldComponentUpdate` method.

(Under the hood, `React.PureComponent` is just `React.Component` with a predefined `shouldComponentUpdate` method that does a _shallow comparison_ of the props and state to decide whether the component needs to be re-rendered.)

With that in mind:

**Use plain functions** for _simple components that are not used extensively_; just because they're stateless, it doesn't mean they're pure components, or that you benefit from the performance enhancements of `React.PureComponent`.

(In the future, React may implement optimizations for functional components to address this.)

**Extend `React.PureComponent`** when your component depends on simple props, and has a simple state, and you need better performance.

**Extend `React.Component`** in all other cases. Consider implementing a `shouldComponentUpdate` method to avoid re-rendering each time the props or state changes.

**Note** that when using `PureComponent` or `shouldComponentUpdate` you'll benefit from using [immutable objects](./immutability.md).

See also [this response from Stack Overflow](https://stackoverflow.com/questions/40703675/react-functional-stateless-component-purecomponent-component-what-are-the-dif#40704083) and be aware of [some caveats around `React.PureComponent`](./purecomponent-caveats.md).
