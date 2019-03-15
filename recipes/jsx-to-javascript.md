# Reading JSX as if it were JavaScript

It's easier to think about how React works after you learn to look at JSX as if it were JavaScript.

Even though JSX is not a part of React _per se_, you'll frequently see them in the same sentence. That's because JSX is the language of choice for an easier, more readable way to use a fundamental part of React, which is:

```js
React.createElement(type, props, ...children)
```

to build up all the components and nested elements that make up your app.

> Otherwise, you're free to:
>
> * [not use JSX][react-without-jsx] to write React components
> * use a shorthand other than JSX to write React components
> * transform JSX to something other than `React.createElement` calls

A _transpiler_, such as [Babel](https://babeljs.io/), knows how to transform the JSX into JavaScript. You can try out some JSX in the [Babel Playground][babel-playground] to see what the resulting JavaScript looks like:

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

> We can instruct Babel to use something other than `React.createElement` when transforming JSX, by writing `/* @jsx some-string */` at the top of the JavaScript file. Try something crazy like `/* @jsx λ */` to see what happens.

So, unless we instruct Babel otherwise, JSX is transformed to `React.createElement` calls at build-time. Then, when we execute the code, the calls to `React.createElement` themselves return something even barer: plain JavaScript objects that describe our elements. For example, running:

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

Let's unpack this object line by line:

The `$$typeof` property has an interesting backstory: it exists to improve React's resilience against malicious markup, as [Dan Abramov explains here](https://overreacted.io/why-do-react-elements-have-typeof-property/).

Next we see the `type` and `props` we defined for the element, with a few notes:

* `key` and `ref`, which are a couple of props with special meaning in React, will not be part of the `props` object. Instead, they have their own properties inside the resulting object.
* `children` is treated as any other prop on the element. Notice that if you have a single child to the element, `props.children` will be a primitive value (in this case, a string). When we have many children to an element, `props.children` will become an array.

Finally, some miscellaneous, underscore-prefixed stuff set up by React (some only used in _development mode_).

> 📖 The source code for `React.createElement` is in [ReactElement.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js), if you're curious to read it.

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

Note that JSX recognizes element types that have dots in their name, so in this particular case, it works even with:

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

However, expressions any more complicated than that, such as `<components[props.type] />`, will not work.

### JavaScript inside JSX

JSX allows JavaScript __expressions__ for props, including `children`, by using the curly braces (`{}`). It does not, however, allow JavaScript statements. I remember being confused about this when I was starting out, but if you look at how directly and unassumingly Babel places them in the resulting `React.createElement()`, it's clear that having JavaScript statements is untenable, as it requires more work of the transpiler to make them into valid JavaScript.

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

It's also worth noting that any prop set as a string in JSX will remain a string throughout the process — there's no _"oh this looks like a number, let me convert it"_ process going on:

```jsx
// Input:
const Button = props => <Button tabindex='0' disabled='true'/>;

// Output:
const Button = props => React.createElement(Button, {
  tabindex: "0",
  disabled: "true"
});
```

The only case where this happens is with boolean props (the ones that are merely present, but don't have a value), which _do_ show up as `true`:

```jsx
// Input:
const Button = props => <Button disabled/>;

// Output:
const Button = props => React.createElement(Button, { disabled: true });
```

Otherwise, you need to set the props as JavaScript expressions for them to be of the intended type:

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

## Conclusion

At the end of the day, JSX is just an nice way to write big-ass JavaScript objects that represent elements, or element trees, in your application. So, if you look at `<button>` and remember that if you strip all the onion layers you get `{ type: 'button', props: {} }`, I think many more things in React start to make more sense.

Further reading from the official docs:

* [Introducing JSX][introducing-jsx]
* [JSX in depth][jsx-in-depth]

[wtf-is-jsx]: https://jasonformat.com/wtf-is-jsx/
[introducing-jsx]: https://reactjs.org/docs/introducing-jsx.html
[jsx-in-depth]: https://reactjs.org/docs/jsx-in-depth.html
[react-without-jsx]: https://reactjs.org/docs/react-without-jsx.html
[babel-playground]: https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA
