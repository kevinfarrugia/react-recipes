# The `useBounds` hook — measuring DOM elements

We sometimes need to measure DOM elements to find their size or position. 

For example, we might build [a custom Slider component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) and we need to derive the value for the slider from the pointer position and the bounds of the DOM element.

Depending on our needs, there might be several ways to implement the `useBounds` hook. A first question is whether we need to refresh the bounds on each render / after each render, or just once (then think harder about what we mean by _once_). Let's look at some approaches.

## Ingredients

The ingredients vary by approach:

* [`useRef`](../use-ref.md)
* [`useEffect`](../use-effect.md)
* [`useLayoutEffect`](../use-layout-effect.md)

## Implementation

### First try: `useRef` + `useEffect` + `useState`

```js
function useBounds(ref) {
	let [ bounds, setBounds ] = useState();
	useEffect(() => {
		if (!ref.current) return;
		setBounds(ref.current.getBoundingClientRect());
	});
	return bounds;
}
```

This causes an _infinite loop_, because the effect triggers a change in state, which triggers a re-render, which in turns triggers the effect again. We can make `useEffect` depend on `ref.current`, which in most cases will not change:


```js
function useBounds(ref) {
	let [ bounds, setBounds ] = useState();
	useEffect(() => {
		if (!ref.current) return;
		setBounds(ref.current.getBoundingClientRect());
	}, [ref.current]);
	return bounds;
}
```

This rids us of the _infinite loop_, [but there's a problem]().