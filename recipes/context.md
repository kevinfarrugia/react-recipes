# The Context API

__Status:__ _Work in progress_

## What makes the context API

The Context API is invoked through the `React.createContext()` method. It returns an object containing two special React components:

* `Provider` 
* `Consumer`

`Provider` and `Consumer` are special types of components, distinct from functional components and class-based components, and have their own way of communicating that is outside of the normal lifecycle. TODO elaborate.

If you place these components in your application tree, they'll be able to communicate directly. 

What might you use Context for?

TODO

Let's start by creating our context:

```js
import React from 'react';
let ThemeContext = React.createContext();
```

We now have access to this particular context's `Provider` and `Consumer` components through `ThemeContext.Provider` and `ThemeContext.Consumer`, respectively.

Let's use them in our application.

```jsx

class Application extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			theme: 'light'
		};
	}

	render() {
		return (
			<ThemeContext.Provider value={this.state.theme}>
				<Toolbar />
				<Content>
					<ThemeContext.Consumer>
					{
						value => <Sidebar theme={value} />
					}
					</ThemeContext.Consumer>
				</Content>
			</ThemeContext.Provider>
		);
	}
}

```

A few things are happening here:

Assuming we need to know the current theme across our app, we wrap everything in `ThemeContext.Provider`, so that we can potentially use `ThemeContext.Consumer` anywhere inside. We set the single prop accepted by the Provider, `value`, to a value from the application's state. Always remember to pass the `value` prop, as ommitting it will make it `undefined` inside the Consumers! 

Somewhere down the road, a `ThemeContext.Consumer` 

The Consumer accepts a single child as a function (this is an example of the Render Prop pattern TODO link). The function will receive the `value` from the Provider as its only argument.


When deciding whether to update its consumers, the `Provider` will check whether its value has changed with the `Object.is` comparison. You can think about it as mostly a strict equality: 

```js
// this...
Object.is(objectA, objectB);

// is mostly the same as:
objectA === objectB;
```

(To learn more about the subtle differences between `Object.is` and `===`, check out this TODO)

When the `Provider`s `value` prop changes, all its descendant `Consumer`s will get updated, regardless of whether between the Provider and the Consumer there's a component that returns `false` from its `shouldComponentUpdate` lifecycle methods. 

### When do Providers and Consumers re-render?

Whenever a `render()` method that contains a Provider component is invoked, the Provider, and the whole tree underneath it, get re-rendered, regardles of whether its `value` prop has changed or not, through the normal React flow of things.

If the `value` prop changes, and even if down the tree there's a component that returns `false` from its `shouldComponentUpdate` lifecycle method, Consumer components further down still get updated. (We mentioned earlier that Provider and Consumer have a separate way of communicating that is not related to the normal React flow). The Provider really, really, wants to update its Consumers no matter what. 

### How can a Consumer talk back to its Provider?

All that a Consumer gets from its Provider is the content of the Provider's `value` prop, so for the Consumer to alter values in the context, we need to pass a function in the `value` that can update the context.

(For the sake of brevity, I'm ommitting any intermediate components that may lay between the Provider and the Consumer. Imagine they are far, far away from each other in the component tree.)

```jsx

class Application extends React.Component {
	constructor(props) {
		super(props);
		this.toggleTheme = this.toggleTheme.bind(this);
		this.state = {
			theme_context: {
				theme: 'light',
				toggleTheme: this.toggleTheme
			}
		}
	}

	toggleTheme() {
		this.setState(current_state => {
			theme_context: {
				...current_state.theme_context,
				theme: current_state.theme_context.theme === 'light' ? 'dark' : 'light'
			}
		})
	}

	render() {
		return (
			<ThemeContext.Provider value={this.state.theme_context}>
				...
				<ThemeContext.Consumer>
					{
						value => 
							<Sidebar 
								theme={value.theme} 
								toggleTheme={value.toggleTheme}
							/>
					}
				</ThemeContext.Consumer>
				...
			</ThemeContext.Provider>
		)
	}
}
```

Let's figure out what everything does. 

First of all, let's look at what we're setting as a `value` to the Provider: we want to include, along with the `theme`, a callback `toggleTheme` with which to toggle the application's theme from within the Consumer.

We might be tempted to pass it as:

```jsx
	<ThemeContext.Provider
		value={
			{
				theme: this.state.theme,
				toggleTheme: this.toggleTheme
			}
		}
	>
		...
```

But by doing this, we're creating a _new_ object each time the render() method of our application is invoked, and needlessly update all the Consumers, regardless of whether the theme changed or not. And remember, Consumers are immune to PureComponent / shouldComponentUpdate optimizations, so we really don't want to do this.

Instead we package everything we want to pass our Provider into the state, under the `theme_context` key. This way, the object we pass as the Provider's `value` stays the same as long as we don't alter it.

The second thing to notice is we're passing the `toggleTheme` callback function to the Provider, and this function is able to change the `theme` value from the context, by calling `setState` on the Application component.


