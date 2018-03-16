# Use the best `setState` style for the job

[`setState`](https://reactjs.org/docs/react-component.html#setstate) can be invoked in many ways, and the decision to choose one over the other boils down to two questions:

* _Does the new state depend on the current state?_
* _Do I need to know I've set the state?_

Here's a cheatsheet below to help you decide on how to update the state:

Does it depend on the current state? | No | Yes
------------------------------------ | -- | ---
No notification of change | `setState(object)` | `setState(function)`
Notified of _each_ change | `setState(object, callback)` | `setState(function, callback)`
Notified of _batched_ changes | `setState(object)` and implement `componentDidUpdate` | `setState(function)` and implement `componentDidUpdate`

## The flavors of `setState`

### `setState(object)`

__When the new state is independent of the current state,__ you can call `setState` with a plain object that will be [shallowly merged](../glossary.md#merge-shallow) into the current state. This is the simplest form:

```js
this.setState({ count: 5 })
```

### `setState(function)`

__When the new state depends on the current state,__ always call `setState` with a function.

`setState` is an asynchronous method. It tells React to update the state _eventually_, but not necessarily right away. So using `this.state` directly to access the current state will not always give us the latest values.

When you call `setState` with a function, the function gets the current state as its first parameter, so you can build opon it. In the example below, a counter gets incremented with each `tick()`:

```js
tick() {
  this.setState(
    current_state => {
      return {
        count: current_state.count + 1
      }
    }
  );
}
```

What if it turns out __your new state coincides with your current state__? Starting with React 16, you can `return null` from the updater function to cancel a pointless state update. Below, a counter which stops counting at 100:

```js
count() {
  this.setState(
    current_state => {
      let new_count = Math.min(current_state.myvalue + 1, 100);
      return new_count !== current_state.count ? {
        myvalue: new_count
      } : null;
    }
  )
}
```

The `setState(function)` flavor also _shallowly merges_ the new state into the current state, so you only need to return the properties you want to update.

### `setState(object or function, function)`

__If you want to know when you've updated the state,__ there are two main ways to know:

* either supply a callback as the second paramenter of `setState`, or
* implement the `componentDidUpdate` method in your component.

I mentioned earlier that `setState` _eventually_ updates the state, but not right away. The example below is not accurate:

```js
tick() {
  this.setState({ count: 5 });
  console.log("I've updated the state");
}
```

Instead `setState` accepts as a second parameter a _callback function_ that gets called once the state is _actually_ updated:

```js
tick() {
  this.setState({ count: 5 }, () => {
    console.log("I've updated the state");
  });
}
```

In addition to being asynchronous, `setState` calls may also be _batched_, in that React will take a set of `setState` calls and merge them together. That prevents your component from being overwhelmed with frequent state updates — you might call `setState` a hundred times and the component gets updated only once, with the latest state.

__Future-proofing:__ Although right now (React 16.2) batching only happens in a handful of cases, future versions of the library may make extensive use of batching for optimizing performance. It's a good rule of thumb to assume all `setState` will be batched.

__Gotcha:__ when `setState` calls with callback functions get batched, these callbacks will be invoked _after_ the states have been merged, so reading `this.state` inside the callback may not give you the value you expect:

```js
componentWillMount() {
  this.setState({ count: 5 }, () => { console.log(this.state.count) });
  this.setState({ count: 6 }, () => { console.log(this.state.count) });
}
```

In the example above, both `console.log`s will output the value `6`, since `setState` calls inside lifecycle methods get batched, and both callbacks are invoked after the `count` went from `5` to `6`.

## The `componentDidUpdate` method

Another way of telling that the state has been updated is by implementing the `componentDidUpdate` [lifecycle method](./lifecycle.md). It gets invoked immediately after each render.

```js
componentDidUpdate(previous_props, previous_state) {
  if (this.state.count !== previous_state.count) {
    console.log(this.state.count);
  }
}
```

### `setState` callback function vs. `componentDidUpdate`

While both the `setState` callback function and the `componentDidUpdate` method can be used to keep track of changes in the state, there are subtle differences to how they work:

The `componentDidUpdate` method will only be invoked once, after `render`, even if the update is a result of several (batched) `setState` calls that triggered it. As with `render`, it will only be invoked if `shouldComponentUpdate` returns `true`. 

In contrast, callbacks on `setState` will always be triggered, even if the component does not update as a result. They also allow you to discern specific `setState` calls, something that is difficult to do with `componentDidUpdate`. 

### Favor `componentDidUpdate`

In general, you should use the behavior of `componentDidUpdate` to think about observing changes in state. It's easier to for everyone to follow along with your code if it's all in a single method, rather than scattered as callbacks to all the `setState` calls in your component. 

It also benefits from optimizations: the batching of `setState` calls results in a single `componentDidUpdate`; and the `shouldComponentUpdate` method can potentially prevent pointless updates.

However, if the need arises for absolutely knowing about each and every `setState` call, or specific `setState` calls in the code, remember you can use a _callback function_, but be aware of its peculiarities to stay out of trouble.

## Further reading

* https://stackoverflow.com/a/48610973/21613
* https://github.com/facebook/react/issues/11527#issuecomment-360199710
