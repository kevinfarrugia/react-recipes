# Storing derived data

In a functional programming utopia, you'd have your component be a function of the props and state, devoid of any side-effects — data flows in, gets transformed as necessary, then gets rendered to the DOM. 

But if the transformations are expensive, the purely functional approach may be unnecessarily wasteful and we _can_ concede to storing some _derived data_ so we don't have to compute it every time we re-render the component.

Where to store this additional data? Why, directly on the component itself:

```js
this.some_derived_data = expensive_computation(this.props);
```

As to when to compute the data, we can use the most appropriate [lifecycle methods](./lifecycle.md) depending on what we're deriving.

## Data that depends on `props`

If the data only depends on `props`, we need to compute our derived data in two separate methods:

* `constructor` to have the data for the first render, as the component is being mounted;
* `componentWillReceiveProps` for any subsequent changes in props.

We may also check within `componentWillReceiveProps` whether the props we're interested in have actually changed before committing to any heavy processing:

```js
componentWillReceiveProps(new_props) {
	if (this.props.foo !== new_props.foo) {
		this.derived_data = expensive_computation(new_props.foo);
	}
}
```

## Data that depends on `state`

If the data depends, in part or in whole, on some aspect of the `state`, the thing we should __avoid__ is putting the derived data on the state along with the original data:

```js
setState({
	data: somedata,
	derived_data: expensive_computation(somedata)
});
```

As you can read within the article about [using the appropriate `setState` style for the job](./set-state.md), we want to benefit from React's batching of `setState` calls and not do any heavy processing on data that may be gone the next second. If our derived data is used for rendering, we want to make sure we only compute it when it's actually needed. A good place to do this is in the `componentWillUpdate` method, which gets called right before `render`:

```js
componentWillUpdate(new_props, new_state) {
	if (this.state.foo !== new_state.foo) {
		this.derived_data = expensive_computation(new_state.foo);
	}
}
```

As in the case of `props`, we also need to perform this computation in the `constructor` (based on whatever we have as our initial state), since `componentWillUpdate` is not called before the initial render.

## Takeaways

* It's okay to store additional data on the component, to avoid heavy computations;
* Refresh this derived data in the `constructor` and in the appropriate update method: `componentWillReceiveProps` for data that depends on props, and `componentWillUpdate` for data that depends on the state (or a combination of state & props).