# Reading JSX as if it were JavaScript

I think it's easier to reason about how React works after you learn to look at JSX as if it were JavaScript. In this article, we're taking it apart to see how it actually ends up in the browser. 

## From JSX to JavaScript

[The official page][jsx] says JSX is _a concise and familiar syntax for defining tree structures with attributes_. That is, JSX allows us to describe a hierarchy of elements — either native DOM elements, or our own, custom ones, based on function and class components — in a language that looks a lot like HTML but which pre-processors ultimately turn into JavaScript.

JSX is not a part of React _per se_. See, React itself has a _syntax for defining the tree structures with attributes_ that make up an application. It's the humble [`createElement`][create-element]:

```js
React.createElement(type, props, ...children)
```

We can use it to create a structure of nested elements. But while it's somewhat concise, it's not too familiar. Nesting a bunch of `createElement()` statements quickly becomes unreadable, so that's where JSX comes in and lets us write the _sort-of-HTML_ that gets transformed, by way of [Babel](https://babeljs.io/) or a similar _transpiler_, into `React.createElement` statements<sup>1</sup>. This happens at build-time, so the browser will never know JSX was there in the first place.

You can try out some JSX in the [Babel Playground][babel-playground] to see what the resulting JavaScript looks like:

```jsx
// Input:
function Button(props) {
	return <button type='button'>{props.label}</button>;
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

In turn, when the browser executes the calls to `React.createElement`, they themselves return something even simpler: plain JavaScript objects that describe our elements. For example, running:

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

The `$$typeof` property identifies the object as a React element. [Dan Abramov explains its backstory](https://overreacted.io/why-do-react-elements-have-typeof-property/) as a way to improve React's resilience against malicious markup.

Next we see the `type` and `props` we defined for the element. This is the "meat" of our object and it mostly maps 1:1 to the corresponding `createElement` call, with a few exceptions:

1. `key` and `ref`, which are props with special meaning in React, will not be part of the `props` object. Instead, they get their own properties inside the ReactElement object. They're not part of a component's interface with the world, so you won't be able to access neither the `key`, nor the `ref`, from inside the component.
2. `children` is treated as any other prop on the element. In our example, since we have a single child to the element, `props.children` is be a simple value — the string `Click me`. If we had more than one child to the element, `props.children` would have been an array.

Finally, React has set up some miscellaneous, underscore-prefixed stuff on the object. Some of these privates are only used in _development mode_, for warnings and stuff like that, and for the purpose of this article, we'll ignore them.

> 👉 Ultimately, all the JSX in your application will produce plain, nested JavaScript objects that describe React elements.

## How JSX works and what it tells us

The way JSX is transformed to JavaScript can give us some insights on how things work under the hood.

### Element type casing

When you write a tag in JSX, the casing of the tag name matters. `<button/>` will become `{ type: 'button' }`, a string identifying it as a native DOM element. On the other hand, a capitalized `<Button>` tag will become `{ type: Button }`, i.e. a reference to the React component your element is based on.

If you want to store the reference to a component in a variable, you need to make the variable _capitalized_ for JSX to pick up on it as a component reference, rather than a native DOM element:

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

JSX allows JavaScript __expressions__ for props, including `children`, if you wrap them in curly braces (`{}`). It does not, however, allow JavaScript statements. I remember being confused about this when I was starting out because I was trying to look at JSX as if it were a templating language.

Looking instead at how Babel places the expressions in the resulting `React.createElement()` _word-for-word_, with no interpreting whatsoever, clarifies why everything between curly braces needs to make sense as something to assign to a prop.

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

You may also notice that any prop set as a string in JSX will remain a string throughout the process — neither Babel, nor React go _"oh, this looks like a number, let me convert that for you"_:

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

Otherwise, you need to pass the props as JavaScript expressions for them to retain the intended type:

```jsx
// Input:
const Button = props => <Button tabindex={0} disabled={true} />;

// Output:
const Button = props => React.createElement(Button, {
	tabindex: 0,
	disabled: true
});
```

### The element's children

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

We've seen in the previous section that when JSX becomes a JavaScript object, `children` are lumped together with the other props in ReactElement's `props` object. So there's really nothing stoping us (except common sense, that is) from renouncing this benefit and writing it up as a normal prop with an array value:

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

The way the `children` prop ends up with an array that mixes text nodes, elements, and JavaScript expressions, gives us an extra insight: even when our component employs the conditional rendering of some child, the component still has a _fixed_ number of children. Consider this component:

```jsx
function Bag(props) {
  return (
    <div>
      	This is my bag.
      	{ props.empty && <span>...and it's empty!</span> }
  	</div>
  );
}
```

Whenever the `empty` prop is truth-y, an additional message (and thus, an additional DOM element) is shown. My old JSX-as-templating-language mind would think React has to do some kung-fu to update the DOM when the message needs to be shown or hidden. But it's actually very simple: regardless of what the expression evaluates to when the component is rendered, it still takes up a slot in the `children` array:

```js
function Bag(props) {
	return React.createElement(
		"div", 
		null, 
		"This is my bag.", 
		props.empty && React.createElement("span", null, "...and it's empty!")
	);
}
```

It's just that the slot can be filled with either `false`, or a React element, depending on what the expression evaluates to. And since React __won't render__ a `false` child, this amounts to adding/removing the child in the second slot from the DOM.

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

In the resulting JavaScript, `_extends` is a polyfill Babel introduces for cases where [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) is unavailable.

## Conclusion

At the end of the day, JSX is just an nice way to write big-ass JavaScript objects to represent the elements, and element trees, that make up your application. If you look at a `<button>` and remember that when you strip all the onion layers you get an object akin to `{ type: 'button', props: {} }`, I think many more things in React start to make more sense.

Further reading from the official docs:

* [Introducing JSX][introducing-jsx]
* [JSX in depth][jsx-in-depth]

---

<sup>1</sup> We're free to:

* [not use JSX][react-without-jsx] to write React components;
* use a shorthand other than JSX to write React components;
* transform JSX to something other than `React.createElement` calls. Tell this to Babel by writing `/* @jsx some-string */` at the top of the JavaScript file. Try something crazy like `/* @jsx λ */` in the Playground to see what happens.

[create-element]: https://reactjs.org/docs/react-api.html#createelement
[jsx]: https://facebook.github.io/jsx/
[wtf-is-jsx]: https://jasonformat.com/wtf-is-jsx/
[introducing-jsx]: https://reactjs.org/docs/introducing-jsx.html
[jsx-in-depth]: https://reactjs.org/docs/jsx-in-depth.html
[react-without-jsx]: https://reactjs.org/docs/react-without-jsx.html
[babel-playground]: https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA
