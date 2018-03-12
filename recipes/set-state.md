# Use the best `setState` style for the job

[`setState`](https://reactjs.org/docs/react-component.html#setstate) can be invoked in many ways, and the decision to choose one over the other boils down to two questions:

* _Does the new state depend on the previous state?_
* _Do I need to know I've set the state?_

Here's a cheatsheet below to help you decide:

Depends on previous state ? | No | Yes
--------------------------- | -- | ---
No notification of change | `setState(object)` | `setState(function)`
Notified of _each_ change | `setState(object, callback)` | `setState(function, callback)`
Notified of _batched_ changes | use `componentDidUpdate` | use `componentDidUpdate`

__When your new state does not depend on the previous state,__ you can call `setState` with a plain object that will be _shallowly merged_ into the existing state:

```js
this.setState({ myvalue: 5 })
```

__If the new state depends on the previous state,__ always call `setState` with a function. The function gets the previous state as its first parameter, so you can build opon it. The example below simulates a counter that gets incremented with each call to `increment`.

```js
increment() {
	this.setState(
		previous_state => {
			return {
				myvalue: previous_state.myvalue + 1
			}
		}
	);
}
```

What if it turns out __your new value coincides with your old value__? Starting with React 16, you can `return null` from the updater function to prevent the state from updating pointlessly. In the example below, our counter is capped at 100:

```js
increment() {
	this.setState(
		previous_state => {
			let new_value = Math.min(previous_state.myvalue + 1, 100);
			return new_value !== previous_state.myvalue ? {
				myvalue: new_value
			} : null;
		}
	)
}
```

__If you want to know when you've updated the state,__ you have (at least) two options:

* either supply a callback to `setState`, or
* implement the `componentDidUpdate` method in your component

`setState` is an asynchronous method, in that it tells React to update the state _eventually_, so reading `this.state` immediately after `setState` will not give you the updated values. Instead, you pass a _callback function_ to the `setState` method, that gets called immediately after your new state is applied:

```js
this.setState(
	{ myvalue: 5 }, 
	() => {
		console.log(this.state.myvalue);
		// => '5'
	}
)
```

In addition to being asynchronous, setState also gets _batched_, in that React will take a set of `setState` calls and merge them together, if these calls happen in very quick succession (such as when you set the state in response to mouse movement). That prevents your component from being overwhelmed with frequent state updates — you might call `setState` a hundred times and the component gets re-rendered only a handful of times.

When you want to want to be informed of changes in the state, you need to decide whether to strap onto the `setState` firehose and be informed a hundred times, or get informed only as often as your component gets re-rendered. 

The firehose option is setting a callback to the `setState` function. 

__Pros:__

* Potentially know of _each time_ you set the state, if you need to do so;
* Listen to only the `setState` calls you want to.

__Cons:__

* You need to provide a callback to all the places that call `setState` in your component.
* You may receive a potentially overwhelming amount of updates.


The "debounced" option is implementing the `componentDidUpdate` method in your component:

```js
componentDidUpdate(previous_props, previous_state) {
	if (this.state.myvalue !== previous_state.myvalue) {
		console.log(this.state.myvalue);
	}
}
```

__Pros:__

* Know when the state has been changed from several places in the component;
* Get a reasonable amount of updates.

__Cons:__

* The inability to distinguish between the _sources_ of the update, if you only want to react to a _certain_ `setState` call.

(In regards to the above, it may be that you need to rethink your state so that you don't need to distinguish between the _sources_ of the update.)