# The Component lifecycle

_This article reflects the React 16.4 API_

[There are two ways](./components.md) of defining components: as simple functions or as classes. 

React constantly adds and removes elements from the DOM to reflect the state of your application. Each individual element in your app's component tree goes through three phases throughout its lifetime:

* __Mounting__ is when React first adds the element to the DOM;
* __Updating__ is when React updates the DOM to match the element's props and state;
* __Unmounting__ is when React removes the element from the DOM.

Components defined as functions are not aware of these phases. Whenever React needs to add or update a function-based element to the DOM, it evaluates the function. Props go in, UI comes out. When it needs to remove the element from the DOM, it just deletes its DOM subtree.

Class-based elements, on the other hand, afford more control. Besides being able to hold an internal `state`, you can define a handful of so-called _lifecycle methods_ with which to observe and direct the component's behavior in each of these three phases. 

Below we discuss each of the phases and the lifecycle methods relevant to them. For a more concise visual representation, see [this interactive diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).

## The Mounting phase

When React reckons it needs to place an element in the DOM that was not there before, and notices the element is a class-based component, it will first create an instance of that class by calling its `constructor`. 

A component constructor is optional: we only write it when we need it. This is the case for a couple of situations:

* we want our component to have an internal `state`; the constructor is the place to initialize it.
* we want to attach event listeners to some elements inside the component; the constructor is where we bind the events to the component instance.

The following example does both:

```jsx

class Counter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 1
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		this.setState(
			current_state => {
				return {
					count: current_state.count + 1
				}
			}
		)
	}

	render() {
		return (
			<div onClick={this.handleClick}>
				{ this.state.count }
			</div>
		)
	}
}
```

The constructor receives the `props` as its only argument. The first thing you need to do in the constructor is to call `super(props)`. (If you're curious why that's the case, Dan Abramov [explains it here](https://overreacted.io/why-do-we-write-super-props/)).

After calling the constructor, React does an _initial render_ that consists of the following methods:

* [`getDerivedStateFromProps(props, state)`][getderivedstatefromprops]
* [`render()`][render]

Finally, React lets us know the element's DOM is ready by calling `componentDidMount`.

As a recap, here's the succession of methods called in the _mounting phase_:

* [`constructor(props)`][constructor]
* [`getDerivedStateFromProps(props, state)`][getderivedstatefromprops]
* [`render()`][render]
* [`componentDidMount()`][componentdidmount]

## The Unmounting phase

The opposite of mounting is _unmounting_, when React no longer needs an element to be in the DOM. A single method is called before the component is removed from the DOM:

* [`componentWillUnmount()`][componentwillunmount]

This is symmetrical to [`componentDidMount`][componentdidmount], so whatever you do in `componentDidMount`, you probably want to do the opposite in `componentWillUnmount`.

## The Updating phase

Once a component is mounted to the DOM, all subsequent re-renders will follow the same sequence of lifecycle methods:

* [`getDerivedStateFromProps(props, state)`][getderivedstatefromprops]
* [`shouldComponentUpdate(next_props, next_state)`][shouldcomponentupdate]
* [`getSnapshotBeforeUpdate(previous_props, previous_state)`][getsnapshotbeforeupdate]
* [`render()`][render]
* [`componentDidUpdate(previous_props, previous_state, snapshot)`][componentdidupdate]

The succession is similar to the _mounting phase_, but with more hooks to control how the component responds to subsequent re-renders:

* `shouldComponentUpdate` controls whether the component should re-render. That is, whether its `render()` method needs to be re-evaluated, or whether its DOM tree can remain as-is for the current update.
* `componentDidUpdate` is called after each `render()`, much like `componentDidMount` is called after the initial render.
* `getSnapshotBeforeUpdate` is rather infrequent, so we're not going to discuss it here.

When does React re-evaluate, and possibly re-render a component? Whenever the state in your component, or somewhere above it in the component tree, was updated through a `setState()` call.

In particular, when you call `setState()` inside your component, React needs to re-evaluate it and see whether the updated state warrants updates to the DOM. 

Similarly, when a parent component has its state updated, and its `render()` method invoked, its descendants are also re-evaluated with the props received from their parent.

__Note:__ I'm purposely avoiding the word _changed_ when talking about state updates. React does _not_ check whether something in `prop` or `state` has actually changed or not when re-evaluating elements. It simply says: _"here's what I have right now"_. 

## Error handling

* [`componentDidCatch`][componentdidcatch] is emitted whenever there was an error in any of the _child components_, and it's the method used for building [Error Boundaries](./error-boundaries.md) in your app.

[constructor]: https://reactjs.org/docs/react-component.html#constructor
[getderivedstatefromprops]: https://reactjs.org/docs/react-component.html#getderivedstatefromprops
[render]: https://reactjs.org/docs/react-component.html#render
[componentdidmount]: https://reactjs.org/docs/react-component.html#componentdidmount
[componentwillunmount]: https://reactjs.org/docs/react-component.html#componentwillunmount
[shouldcomponentupdate]: https://reactjs.org/docs/react-component.html#shouldcomponentupdate
[componentdidupdate]: https://reactjs.org/docs/react-component.html#componentdidupdate
[getsnapshotbeforeupdate]: https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
[componentdidcatch]: https://reactjs.org/docs/react-component.html#componentdidcatch