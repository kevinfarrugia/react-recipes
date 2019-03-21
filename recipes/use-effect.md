# The `useEffect` Hook

The `useEffect` hook lets your function component run _side effects_.

What are side effects (or, for short, _effects_)? They are "things that happen" inside the component, which may affect other components or alter the DOM. They can't be done during the render phase. Things like:

- fetching some data
- subscribing to things that emit events
- changing the DOM (e.g. `document.title`)
- reading from the DOM??

This hook serves a purpose similar to some [lifecycle methods](./lifecycle.md) inside class components:

- `componentDidMount` (executed after the first render)
- `componentDidUpdate` (after a subsequent render)
- `componentWillUnmount` (right before the component is removed from the DOM)

While in a class component a particular effect was spread among many lifecycle methods, `useHook` lets you group the feature in a single function that gets executed _after each render_. (Optionally, you can skip an effect on some renders).

The signature of the `useEffect` hook:

```js
useEffect(effect [, dependencies]);
```

where:

- `effect` is a function that performs the effect
- `dependencies` is an array of values on which the effect depends

An effect may look like this:

```jsx
const Component = props => {
  const updateDocTitle = () => {
    document.title = `Current component: ${props.title}`;
  };
  useEffect(updateDocTitle);

  return <div>My component</div>;
};
```

This effect is a simple function that _does something_. And it will do it after each render. But what's the point of setting the same title over and over again? The `dependencies` array lets us control how often the effect is called. If we rewrite it as:

```js
const updateDocTitle = () => {
  document.title = `Current component: ${props.title}`;
};

useEffect(updateDocTitle, [props.title]);
```

...this particular effect will only be executed when `props.title` changes. (The comparison is made as with `Object.is`). You can have more than one dependency in the array, and the effect will be executed if any item in the array has changed.

Additionally, passing an empty array `[]` as the dependencies will make the effect run _only on the initial render_, much like you'd have in `componentDidMount` for a class component.

Note that in general you'd write effects as anonymous functions:

```js
useEffect(() => {
  document.title = `Current component: ${props.title}`;
}, [props.title]);
```

but I had extracted it to a named function to make a point: it's a different function for each render cycle, and when referencing variables from the component's scope in the effect, it will capture their values at that particular moment in time. This is important when you specify arrays of dependencies, because `useEffect` will ignore a particular `updateDocTitle` function until a dependency changes. When a dependency does change, the hook will use the freshest instance of `updateDocTitle`.

### Effects with cleanup

When you update `document.title`, it's something you don't have to clean up after. But other things, such as subscribing to an event emitter or adding a DOM listener, needs to be undone — actions that need reactions. Otherwise we'd be piling up the same event listener over and over again.

To cover this, you can return a _cleanup function_ from your effect:

```js
const mouseMove() {
	let listener = e => { console.log(e) };
	document.addEventListener('mousemove', listener);

	// cleanup function
	return () => {
		document.removeEventListener('mousemove', listener);
	}
}

useEffect(mouseMove);
```

> 📖 For lack of a better name, I call `mouseMove` a **symmetrical function** (TODO link to `javascript-patterns` repo), or a function that encapsulate both an action and its opposite.

After each render, React will call a fresh instance of `mouseMove`, adding the event listener but, crucially — it will call the previous instance's cleanup function beforehand, thus removing the previous listener.

### Conditional execution of `useEffect`

We know that one rule of Hooks is you need to call all of them on each render, so no `if` statements or loops. So to implement an effect hook that gets called only in certain situations, we can make it depend on... something. For example, if you want an effect to run whenever the component becomes active, and stop the moment the compoent goes idle, you can:

```jsx
import { useState, useEffect } from 'react';

const Component = (props) => {
	let [ active, setActive ] = useState(false);

	let mouseMove = () => {
		document.addEventListener('mousemove', ...);
		return () => {
			document.removeEventListener('mousemove', ...);
		}
	};
	useEffect(mouseMove, [ active ]);
}
```

So we can manipulate the state variable `active` by calls to `setActive(true)` and `setActive(false)` in order to control when an effect takes place.

> **Bonus:** What if we want to have the effect not run while `active` is false, but run **after each render** while `active` is true?
> We can write the dependencies as `[active ? {} : null]`. That's because `{} !== {}` but `null === null`. (Technically, it uses `Object.is` which is slightly different than simple equality, but this particular example stands nonetheless).

## Open questions

- unlike `componentDidUpdate`, the dependencies don't allow us to compare the previous value of a piece of props or state; solvable? a case for class components? an anti-pattern in most cases?
- you can't have `useEffects` that does not depend on anything (i.e. runs after each render) and performs a `setState`. Doing so will trigger a new render, and thus a new call to the effect, => infinite loop. Document solutions / workarounds

## See also

- [`useLayoutEffect`](./use-layout-effect.md)

## Futher reading

- [A complete guide to `useEffect`](https://overreacted.io/a-complete-guide-to-useeffect/) by Dan Abramov
