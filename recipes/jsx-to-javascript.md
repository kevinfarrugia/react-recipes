# Reading JSX as if it were JavaScript

I think it's easier to reason about how React works after you learn to look at JSX as if it were JavaScript. [JSX is][jsx]:

> a concise and familiar syntax for defining tree structures with attributes

That is, JSX allows us to describe a hierarchy of elements — either native DOM elements, or our own custom ones — in a language that looks a lot like a HTML, but which pre-processors ultimately turn into something we can manipulate in JavaScript. (Spoiler alert: it's more JavaScript).

And even though JSX is not a part of React _per se_, they're best buds. See, React already has a _syntax for defining the tree structures with attributes_ that make up an application. It's the humble:

```js
React.createElement(type, props, ...children)
```

But it's neither _concise_ nor _familiar_. Nesting a bunch of `createElement()` statements quickly gets unreadable, so that's where JSX comes in and lets us write the _sort-of-HTML_ that gets transformed, by way of [Babel](https://babeljs.io/) or a similar _transpiler_, into `React.createElement` statements. 

You can try out some JSX in the [Babel Playground][babel-playground] to see what the resulting JavaScript looks like:

```jsx
// Input:
function Button(props) {
	return (
		<button type='button'>{props.label}</button>
	);
}

// Output:
function Button(props) {
	return React.createElement(
		"button", // type
		{ type: "button" }, // props
		props.label // children
	);
}
```

To get this out of the way, we're free to:

* [not use JSX][react-without-jsx] to write React components;
* use a shorthand other than JSX to write React components;
* transform JSX to something other than `React.createElement` calls. Tell this to Babel by writing `/* @jsx some-string */` at the top of the JavaScript file. Try something crazy like `/* @jsx λ */` in the Playground to see what happens.

But, unless we instruct Babel otherwise, JSX is transformed to `React.createElement` calls at build-time and the browser will never know JSX was there in the first place. In turn, when the browser executes the calls to `React.createElement`, they themselves return something even barer: plain JavaScript objects that describe our elements. For example, running:

```js
React.createElement(
	"button", // type
	{ type: "button" }, // props
	'Click me' // children
);
```

Results in this object:

```js
{
	"$$typeof": Symbol(react.element),

	// type
  	type: "button",

  	// props (including children)
	props: {
		type: "button",
		children: "Click me"
	},

	// some reserved props
	key: null,
	ref: null,

	// miscellaneous
	_owner: null,
	_self: null,
	_source: null,
	_store: {}
}
```

> The source code for `React.createElement` is in [ReactElement.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js), if you're curious to read it.

Let's unpack this object line by line.

The `$$typeof` property has an interesting backstory: it exists to improve React's resilience against malicious markup, as [Dan Abramov explains here](https://overreacted.io/why-do-react-elements-have-typeof-property/).

Next we see the `type` and `props` we defined for the element, with a few notes:

* `key` and `ref`, which are a couple of props with special meaning in React, will not be part of the `props` object. Instead, they get their own properties inside the ReactElement object.
* `children` is treated as any other prop on the element. Note that since we have a single child to the element, `props.children` is be a simple value — the string `Click me`. If we had many children to the element, `props.children` would have been an array.

Finally, React has set up some miscellaneous, underscore-prefixed stuff on the object. Some of them are only used in _development mode_, for validation.

> 👉 Ultimately, all the JSX in your application will produce plain, nested JavaScript objects that describe React elements.

## Some aspects of how JSX works

### Element type casing

When you write a tag in JSX, the casing of the tag name matters. `<button/>` will become `{ type: 'button' }`, a string identifying it as a native DOM element. On the other hand, a capitalized `<Button>` tag will become `{ type: Button }`, i.e. a reference to the React component your element is based on.

If you want to store the reference to a component in a variable, you need to make the variable _capitalized_ for it to be interpreted as a component reference, rather than a native DOM element:

```jsx
// Input:
function DynamicComponent(props) {
	var ActualComponent = props.component;
	return <ActualComponent />;
}

// Output:
function DynamicComponent(props) {
	var ActualComponent = props.component;
	return React.createElement(ActualComponent, null);
}
```

JSX recognizes element types that have dots in their name, and considers them references to components. So in this particular case, it works even if we write it out directly:

```jsx
// Input:
function DynamicComponent(props) {
	return <props.component />;
}

// Output:
function DynamicComponent(props) {
	return React.createElement(props.component, null);
}
```

However, expressions any more complicated than that, such as `<components[props.type] />`, would (presumably) bloat the JSX grammar, and are not supported.

### JavaScript inside JSX

JSX allows JavaScript __expressions__ for props, including `children`, if you wrap them in curly braces (`{}`). It does not, however, allow JavaScript statements. I remember being confused about this when I was starting out, but if you look at how directly and unassumingly Babel places the expressions in the resulting `React.createElement()`, it's clear that having JavaScript statements is untenable, as it requires more work to make them into valid JavaScript.

```jsx
// Input:
function Button(props) {
	return (
		<Button type='button' disabled={ this.props.disabled }>
			{ this.props.label }
		</Button>
	);
}

// Output:
function Button(props) {
	return React.createElement(Button, {
		type: "button",
		disabled: this.props.disabled
	}, this.props.label);
}
```

It's also worth noting that any prop set as a string in JSX will remain a string throughout the process — there's no _"oh, this looks like a number, let me convert it"_ process at any given moment:

```jsx
// Input:
const Button = props => <Button tabindex='0' disabled='true'/>;

// Output:
const Button = props => React.createElement(Button, {
  tabindex: "0",
  disabled: "true"
});
```

Boolean props — the ones which are merely present in name, but don't have a value — are the exception. They show up as boolean `true` values in the resulting JavaScript:

```jsx
// Input:
const Button = props => <Button disabled/>;

// Output:
const Button = props => React.createElement(Button, { disabled: true });
```

Otherwise, you need to set the props as JavaScript expressions for them to retain the intended type:

```jsx
// Input:
const Button = props => <Button tabindex={0} disabled={true} />;

// Output:
const Button = props => React.createElement(Button, {
	tabindex: 0,
	disabled: true
});
```

### Will anyone think of the `children`

On prop in particular, the `children`, has more syntatic sugar going for it in JSX. Anything between the opening tag and the closing tag of an element is split up into text nodes, expressions, and elements, and passed to React as individual children.  For example:

```jsx
// Input:
function Total(props) {
	return (
		<div>
			Sum: { props.a + props.b }
			<span>Cool, huh!</span>
		</div>
	);
}

// Output:
function Total(props) {
	return React.createElement(
		"div", 
		null, 

		// children
		"Sum: ", 
		props.a + props.b, 
		React.createElement("span", null, "Cool, huh!")
	);
}
```

There's nothing stoping us from renouncing this benefit and writing it up as a normal prop with an array value:

```jsx
function Total(props) {
	return (
		<div 
			children={
				[
					'Sum: ', 
					props.a + props.b, 
					<span>Cool, huh!</span>
				]
			} 
		/>
	);
}
```

Except common sense, that is.

### The spread operator

One last bit of syntactic sugar JSX affords is the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) for props, which allows us to endow an element with a set of props without enumerating them one by one, explicitly. In the example below, we want to spread whichever props the `Button` component receives to the underlying `button` element for some reason:

```jsx
// Input:
function Button(props) {
	return <button type='button' {...props} />;
}

// Output:
function Button(props) {
	return React.createElement(
		"button",
		_extends(
			{ type: "button" },
			props
		),
		"Hello world!"
	);
}
```

In the resulting JavaScript, `_extend` is a polyfill Babel introduces for cases where [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) is unavailable.

## Conclusion

At the end of the day, JSX is just an nice way to write big-ass JavaScript objects to represent the elements, and element trees, that make up your application. If you look at a `<button>` and remember that when you strip all the onion layers you get an object akin to `{ type: 'button', props: {} }`, I think many more things in React start to make more sense.

Further reading from the official docs:

* [Introducing JSX][introducing-jsx]
* [JSX in depth][jsx-in-depth]

[jsx]: https://facebook.github.io/jsx/
[wtf-is-jsx]: https://jasonformat.com/wtf-is-jsx/
[introducing-jsx]: https://reactjs.org/docs/introducing-jsx.html
[jsx-in-depth]: https://reactjs.org/docs/jsx-in-depth.html
[react-without-jsx]: https://reactjs.org/docs/react-without-jsx.html
[babel-playground]: https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA
