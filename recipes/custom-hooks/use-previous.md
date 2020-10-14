# The `usePrevious` hook — remembering previous values

This hook lets us remember the previous value of things — props, state, or any other value.

> Since it's a common use-case, the React docs mention this hook may come as part of a next version of React.

## Ingredients

* [`useRef`](../use-ref.md)
* [`useEffect`](../use-effect.md)

## Implementation

```js
function usePrevious(value) {
	let ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};
```

## Explanation

* `useRef` can be used to store a value inside the component that persists across renders and which can be mutated, much like instance properties on a class component.
* `useEffect` schedules a function to run after the render phase. This is the perfect time to store a snapshot of the value and make it available for the next render.