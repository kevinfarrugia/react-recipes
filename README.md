# react-recipes

[This repository](https://github.com/danburzo/react-recipes/) contains some tried-and-testes ways to work with React, documented [as I figure them out](https://github.com/danburzo/as-we-learn).

## Table of contents

* [Recipes](#recipes)
	* [The best `setState` style for the job](#the-best-setstate-style-for-the-job)
	* [Ways to use `defaultProps`](#ways-to-use-defaultprops)
	* [The `property` pattern for callbacks](#the-property-pattern-for-callbacks)
	* [Ways to define components](#ways-to-define-components)
	* [`React.PureComponent` caveats](#react-purecomponent-caveats)
	* [Passing React components via props](#passing-react-components-via-props)
	* [Passing props to `this.props.children`](#passing-props-to-this-props-children)
* [Further reading](#further-reading)

## Recipes

### The best `setState` style for the job

[`setState`](https://reactjs.org/docs/react-component.html#setstate) can be invoked in many ways, and the decision to choose one over the other boils down to two questions:

* _Does the new state depend on the previous state?_
* _Do I need to know I've set the state?_

Here's a cheatsheet below to help you decide:

Depends on previous state ? | No | Yes
--------------------------- | -- | ---
No notification of change | `setState(object)` | `setState(function)`
Notified of _each_ change | `setState(object, callback)` | `setState(function, callback)`
Notified of _batched_ changes | use `componentDidUpdate` | use `componentDidUpdate`

__When your new state does not depend on the previous state,__ you can call `setState` with a simple object that will be _shallowly merged_ into the existing state:

```js
this.setState({ myvalue: 5 })
```

__If the new state depends on the previous state,__ always call `setState` with a function. The function gets the previous state as its first parameter, so you can build opon it. The example below simulates a counter that gets incremented with each call to `increment`.

```js
increment() {
	this.setState(
		previous_state => {
			return {
				myvalue: previous_state.myvalue + 1
			}
		}
	);
}
```

What if it turns out __your new value coincides with your old value__? Starting with React 16, you can `return null` from the updater function to prevent the state from updating unnecessarily. In the example below, our counter is capped at 100:

```js
increment() {
	this.setState(
		previous_state => {
			let new_value = Math.min(previous_state.myvalue + 1, 100);
			return new_value !== previous_state.myvalue ? {
				myvalue: new_value
			} : null;
		}
	)
}
```

__If you want to know when you've updated the state,__ you have (at least) two options:

* either supply a callback to `setState`, or
* implement the `componentDidUpdate` method in your component

`setState` is an asynchronous method, in that it tells React to update the state _eventually_, so reading `this.state` immediately after `setState` will not give you the updated values. Instead, you pass a _callback function_ to the `setState` method, that gets called immediately after your new state is applied:

```js
this.setState(
	{ myvalue: 5 }, 
	() => {
		console.log(this.state.myvalue);
		// => '5'
	}
)
```

In addition to being asynchronous, setState also gets _batched_, in that React will take a set of `setState` calls and merge them together, if these calls happen in very quick succession (such as when you set the state in response to mouse movement). That prevents your component from being overwhelmed with frequent state updates — you might call `setState` a hundred times and the component gets re-rendered only a handful of times.

When you want to want to be informed of changes in the state, you need to decide whether to strap onto the `setState` firehose and be informed a hundred times, or just get informed as often as your component gets re-rendered. 

The firehose option is setting a callback to the `setState` function. 

__Pros:__

* Potentially know of _each time_ you set the state, if you need to do so;
* Listen to only the `setState` calls you want to.

__Cons:__

* You need to provide a callback to all the places that call `setState` in your component.
* You may receive a potentially overwhelming amount of updates.


The "debounced" option is implementing the `componentDidUpdate` method in your component:

```js
componentDidUpdate(previous_props, previous_state) {
	if (this.state.myvalue !== previous_state.myvalue) {
		console.log(this.state.myvalue);
	}
}
```

__Pros:__

* Know when the state has been changed from several places in the component;
* Get a reasonable amount of updates.

__Cons:__

* The inability to distinguish between the _sources_ of the update, if you only want to react to a _certain_ `setState` call.

(In regards to the above, it may be that you need to rethink your state so that you don't need to distinguish between the _sources_ of the update.)

### Ways to use `defaultProps`

[`defaultProps`](https://reactjs.org/docs/react-component.html#defaultprops) is an object you set on your component class directly to provide default values for your properties. If your component gets initialized without a property (meaning its value is `undefined`), you'll get its default value instead. Note that `null` is a valid value that will not fall back to the default.

So the main purpose of `defaultProps` is to plug any hole in your properties. One thing I like to do is provide empty functions to any callbacks my component supports, so that I don't need to check whether they exist when I invoke them:

```js
class Slider extends React.Component {
	onChange() {
		// no need to check that this.props.onChange exists
		this.props.onChange(this.state.value);
	}
}

Slider.defaultProps = {
	onChange: value => {}
}

```

`defaultProps` is also a good way to document the properties your component accepts:

```js
Slider.defaultProps = {
	// A number that defines the minimum value for the slider
	min: 0,
	
	// A number that defines the maximum value for the slider
	max: 100,

	// A callback that gets invoked each time the slider's value changes
	onChange: value => {}
};
```

You may even go further and document _optional_ properties, whose default value is `undefined`:

```jsx
class Slider extends React.Component {
	onChange() {
		this.props.onChange(this.state.value, this.props.property);
	}
}

Slider.defaultProps = {
	// When defined, the property will be sent along with the value
	// on the `onChange` callback
	property: undefined 
};
```

### The `property` pattern for callbacks

When you need to react to actions from each child component, you'll quickly find yourself in a bind (te-hee). Technically, you'll need to pass a separate callback function to each child, to tell which child is the source of the event.

[The recommendation from the React docs](https://reactjs.org/docs/handling-events.html) is to `bind` the callback function to each child:

```jsx
render() {
	let { items } = this.props;
	return (
		<ul>
			{ 
				items.map(item => 
					<li 
						key={item.id}
						onClick={this.removeItem.bind(this, item.id)}
					>
						{item.label}
					</li>
				)
			}
		</ul>
	);
}

removeItem(id) {
	// remove item with the passed id
}
```

This solution comes with the drawback that each time you render the component, the children always get _different functions_ as their `onClick` callback, causing unnecessary DOM operations.

In case of simple DOM elements, we don't have too many alternatives to this. But for custom components, don't be tempted to use callbacks this way. Instead, I like to use the `property` pattern:

> Make your components accept an optional `property` prop that gets sent along with all callbacks originating from the component.

With this pattern we can simply write:

```jsx
render() {
	let { items } = this.props;
	return (
		<List>
			{ 
				items.map(item => 
					<Item 
						key={item.id}
						property={item.id}
						onClick={this.removeItem}
					>
						{item.label}
					</Item>
				)
			}
		</List>
	);
}

removeItem(id) {
	// remove item with the passed id
}
```

Our `Item` component will gladly accept a `property` prop to pass along to callbacks:

```jsx
class Item extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick(this.props.property);
	}

	render() {
		return (
			<li onClick={this.onClick}>{this.props.children}</li>
		);
	}
}
```

When you apply this pattern across several components, it makes it easy to bind each of them to different parts of the state:

```jsx
	render() {
		return (
			<div className='editor'>

				<Slider 
					value={this.state.slidervalue} 
					property={slidervalue}
					onChange={this.update}
				/>

				<List
					value={this.state.listvalue}
					property={listvalue}
					onChange={this.update}
				/>

				{ // ... etc ... }
			</div>
		)
	}

	update(value, prop) {
		this.setState({
			[prop]: value
		});
	}
```

### Ways to define components

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

__Extend `React.PureComponent`__ when your component depends on simple props, and has a simple state, and you need better performance.

__Extend `React.Component`__ in all other cases. Consider implementing a `shouldComponentUpdate` method to avoid re-rendering each time the props or state changes.

See also [this response from Stack Overflow](https://stackoverflow.com/questions/40703675/react-functional-stateless-component-purecomponent-component-what-are-the-dif#40704083) and read below for some caveats around `React.PureComponent`.

### `React.PureComponent` caveats

When used appropriately, pure components can boost your application's performance by avoiding unnecessary re-renders. It performs a _shallow comparison_ of props and state against their previous values and skips the re-render if nothing (shallowly) changed.

This comparison is reasonably fast (in any case, faster than re-rendering), but be mindful of some situations where you get the worst of both worlds: you perform the comparison, but the component always re-renders anyways. Don't let this happen to you.

__Are you sending functions (callbacks)__ to your component? Make sure you're not always sending a new function, as with `bind`-ing functions in-place (see [The `property` pattern for callbacks](#the-property-pattern-for-callbacks)).

__Are you sending children__ to your component? Remember that `children` is still a prop. Unless you're sending a string as the only child for the component, this property _will always change_. Drop `React.PureComponent` in this case.

__Are you sending React components__ on any props? These props will always change, so you're better off dropping `React.PureComponent`.

### Passing React components via props

Two things right off the bat:

* You can pass React components on any prop, not just `children`, and conversely;
* You can pass anything to `children`, not just React components.

So when modeling the communication between components, you can:

__Create slots to be filled in your component__

```jsx
class Reader extends React.Component {
	render(
		<div className='reader'>
			<div className='sidebar'> { this.props.sidebar } </div>
			<div className='content'> { this.props.content } </div>
		</div>
	) 
}

<Reader
	sidebar={<Sidebar/>}
	content={<Content/>}
/>
```

__Using `children` as the single slot to be filled__

```jsx
class Modal extends React.Component {
	render(
		<div className='modal'>
			<div className='modal__content'>
				{ this.props.children }
			</div>
		</div>
	)
}
```

### Passing props to `this.props.children`

You want your component to augment all its children with some properties. To do so you can use `React.Children.map` and `React.cloneElement`, like so:

```jsx

render() {
	<div>
		{
			React.Children.map(
				this.props.children,
				child => 
					React.cloneElement(child, {
						value: '5'
					})
			)
		}
	</div>
}
```

When a child gets passed to our component, its `value` prop will be overwritten with `5`.

What if instead we want the component to provide fallbacks if some properties are missing from the child? We can do so with a small tweak to our mapping function:

```js
child => React.cloneElement(child, {
	value: '5',
	...child.props
})
```

...in which we put back any of the child props we might have overwritten.

## Further reading

* [reactpatterns.com](http://reactpatterns.com/)
* [react-in-patterns](https://github.com/krasimir/react-in-patterns)
* [react-playbook](https://github.com/kylpo/react-playbook)
