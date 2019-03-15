# Reading JSX as if it were JavaScript

It's easier to think about how React works after you learn to look at JSX as if it were JavaScript.

Even though JSX is not a part of React _per se_, you'll frequently see them in the same sentence. That's because JSX is the language of choice for an easier, more readable way to use a fundamental part of React, which is:

```js
React.createElement(type, props, ...children)
```

to build up all the components and nested elements that make up your app.

Otherwise, you're free to:

* [not use JSX][react-without-jsx] to write React components
* use a shorthand other than JSX to write React components
* transform JSX to something other than `React.createElement` calls

A _transpiler_, such as [Babel](https://babeljs.io/), will transform the JSX into JavaScript. You can write some JSX in the [Babel Playground][babel-playground] to see what the resulting JavaScript looks like:

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
  	// type
  	"button", 

  	// props
  	{
    	type: "button"
  	}, 

  	// children
  	props.label
  );
}
```

We can instruct Babel to use something other than `React.createElement` when transforming JSX, by writing `/* @jsx some-string */` at the top of the file, e.g.:

```jsx
// Input:

/* @jsx λ */
function Button(props) {
	return (
      <button type='button'>{props.label}</button>
    );
}

// Output:

function Button(props) {
  return λ("button", {
    type: "button"
  }, props.label);
}
```

So, JSX is transformed to `React.createElement` calls at build-time. Then, when we execute the code, what all the callse to `React.createElement` do is return plain JavaScript objects that describe the elements. For example, running:

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

	// reserved props
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

* `key` and `ref`, which are props with special meaning in React, will not be part of the `props`. Instead, they're represented separately, with their own properties inside the resulting object.
* `children` is treated as any other prop on the element. Notice that if you have a single child to the element, `props.children` will be a primitive value (in this case, a string). When we have many children to an element, `props.children` will become an array.

Finally, some miscellaneous, underscore-prefixed stuff set up by React (some only used in _development mode_).

> 📖 The source code for `React.createElement` is in [ReactElement.js](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js), if you're curious to read it.

At the end of the day, JSX is just an nice way to write one big-ass JavaScript object that represents an element, or an element tree, in your application. So, if you look at `<button>` and remember that it's basically `{ type: 'button', props: {} }` when that piece of code is run, I think many more things in React start to make more sense.

Further reading from the official docs:

* [Introducing JSX][introducing-jsx]
* [JSX in depth][jsx-in-depth]

[wtf-is-jsx]: https://jasonformat.com/wtf-is-jsx/
[introducing-jsx]: https://reactjs.org/docs/introducing-jsx.html
[jsx-in-depth]: https://reactjs.org/docs/jsx-in-depth.html
[react-without-jsx]: https://reactjs.org/docs/react-without-jsx.html
[babel-playground]: https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA
