# The `useState` hook

[The `useState` hook][use-state] creates a piece of state for the component. Calling the hook returns the current value of that piece of state, and a method to update it, in the form of an array.

```js
let [state, setState] = useState(initialState);
```

> 👉 Having the return value be an array means we can destructure it and name the two parts, `state` and `setState` however we want.

_initialState_ is the initial value for that piece of state, set on the first render. If the initial value is expensive to compute, we can wrap it in a function and React will evaluate it lazily:

```js
let [state, setState] = useState(() => initialState);
```

On each render, the `state` will have the most recent value of that piece of state.

On the other hand, `setState` will refer to the same function on each render — it's stable and we can pass it around to other hooks.

The `setState` function is similar to [the `this.setState()` method](./set-state.md) available in class components. It has two styles:

#### `setState(value)`

In case the new value does not depend on the current one:

```js
setState(new_val);
```

#### `setState(function)`

To make sure you have access to the freshest value of the piece of state, use the functional style. The function receives the current value as parameter, and should return the new value.

```js
setState(current_val => new_val);
```

If the new value is the same as the current one (via `Object.is`), React bails out of a re-render. So if you don't want to go through with an update, just return the current value: `setState(current_val => current_val)`. Otherwise, _new_val_ will completely replace the current value (as opposed to class components' `this.setState`, which shallowly merges the current state with the new state.

[use-state]: https://reactjs.org/docs/hooks-reference.html#usestate
