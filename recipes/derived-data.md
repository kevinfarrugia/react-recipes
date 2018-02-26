# Storing derived data

In a functional programming utopia, you'd have your component be a function of the props and state, devoid of any side-effects — data flows in, gets transformed as necessary, then it gets rendered to the DOM. 

But if the transformations are expensive the purely functional approach may be unnecessarily wasteful and we _can_ concede to storing some _derived data_ so we don't have to re-compute it every time we re-render the component.

We can store this derived data directly on the component itself:

```js
this.some_derived_data = expensive_computation(this.props);
```

Depending on what our derived data depends on, we can use the most appropriate lifecycle methods for the job.

## Data that depends on `props`

If the data only depends on `props`, we need to compute our derived data in two methods:

* `constructor` to have the data for the first time the component is rendered (i.e. it's being _mounted_)
* `componentWillReceiveProps` for any subsequent changes in props.

As a further optimization, we may check in `componentWillReceiveProps` to see if the props we're interested in have actually changed:

```js
componentWillReceiveProps(new_props) {
	if (this.props.foo !== new_props.foo) {
		this.derived_data = expensive_computation(new_props.foo);
	}
}
```

## Data that depends on `state`

If the data depends, in part or in whole, on some aspect of the `state` the thing we should __avoid__ is placing the derived data on the state as well:

```js
setState({
	data: somedata,
	derived_data: expensive_computation(somedata)
});
```

As you can read [when using the appropriate `setState` style for the job](./set-state.md), we want to benefit from React's batching of `setState` calls and not do any expensive computation on data that may be gone the next second. If our derived data is used for rendering things, we want to make sure we only compute it when it's actually needed. A good place to do this is in the `componentWillUpdate` method, which gets called right before rendering:

```js
componentWillUpdate(new_props, new_state) {
	if (this.state.foo !== new_state.foo) {
		this.derived_data = expensive_computation(new_state.foo);
	}
}
```

As in the case of `props`, we also need to perform this computation in the `constructor` (based on whatever we have as our initial state), since `componentWillUpdate` is not called before the initial render.