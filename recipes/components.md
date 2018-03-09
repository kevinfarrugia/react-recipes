# Ways to define components

In the most basic sense, all React components do one thing: take some input (via props) and return a piece of UI. A component can be:

* a simple function
* a class that extends `React.Component` or `React.PureComponent`

__Simple functions__ take the props as input and return the UI:

```jsx
const Button = props => <button>{ props.label }</button>
```

__Classes__ that extend either `React.Component` or `React.PureComponent` take the props as input and return the UI via the `render()` function:

```jsx
class Button extends React.Component {
	render() {
		return <button>{ this.props.label }</button>
	}
}
```

In terms of performance, we need to be mindful of how React decides to re-render components:

* simple functions are re-rendered every time 
* classes extending `React.PureComponent` only re-render when their props or state change
* classes extending `React.Component` re-render every time by default, but this can be controlled by implementing the `shouldComponentUpdate` method.

(Under the hood, `React.PureComponent` is just `React.Component` with a predefined `shouldComponentUpdate` method that does a _shallow comparison_ of the props and state to decide whether the component needs to be re-rendered.)

With that in mind:

__Use simple functions__ for _simple components that are not used extensively_; just because they're stateless, it doesn't mean they're pure components, or that you benefit from the performance enhancements of `React.PureComponent`. 

(In the future, React may implement optimizations for functional components to address this.)

__Extend `React.PureComponent`__ when your component depends on simple props, and has a simple state, and you need better performance.

__Extend `React.Component`__ in all other cases. Consider implementing a `shouldComponentUpdate` method to avoid re-rendering each time the props or state changes.

__Note__ that when using `PureComponent` or `shouldComponentUpdate` you'll benefit from using [immutable objects](./immutability.md).

See also [this response from Stack Overflow](https://stackoverflow.com/questions/40703675/react-functional-stateless-component-purecomponent-component-what-are-the-dif#40704083) and be aware of [some caveats around `React.PureComponent`](./purecomponent-caveats.md).