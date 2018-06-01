# Making things simpler and faster with Memoization

Memoization is a way to cache the result of a function call for a particular set of arguments, and returning the cached result instead of computing it all over again.

Why might we want to do that? When working we React, memoization helps us with a couple of things:

1. Compute derived data based on the component's state and props in a way that's both fast and simple to write.
2. Ensure that we always get the same object as the result when we call the function with the same arguments.

There are two main approaches to memoization:

1. Store all the input/output pairs of the function, so you _never_ compute the same result twice.
2. Only store the input/utput pairs for the last call to the function, so in case you get the same input twice in a row, you return the cached result the second time around.

The second approach is a safer bet. There's the old adage:

> There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton

Storing _all_ the input/output pairs for a memoized function can balloon out of proportions if the cache is long lived and it receives a lot of different inputs, so then you have to start cleaning up old entries from the cache, and the whole thing becomes an ordeal.

Instead, for most purposes, it's enough to just store the last input/output pair to get all the perks and none of the headache. In this example, we're going to use the [`memoize-one`](https://npmjs.org/package/memoize-one) library.

Let's build a small widget that gets a list of names and displays a search box and the names that match the search term. 

The list of names looks like this:

```js
[
	{ id: 1, name: 'Jóhann Jóhannsson' },
	{ id: 2, name: 'Sigur Rós' },
	{ id: 3, name: 'Björk' },
	{ id: 4, name: 'Emilíana Torrini' },
	...
]
```

Let's give it a first shot:

__Widget.js__
```jsx

class Widget extends React.Component {

	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.state = {
			search_term: ''
		};
	}

	render() {

		let filtered_names = this.props.names.filter(
			item => item.name.indexOf(this.state.search_term) > -1
		);

		return (
			<div>
				<input 
					value={this.state.search_term}
					onChange={this.search}
				/>
				<List names={filtered_names} />
			</div>
		);
	}
}
```

List is a `PureComponent` since for a given list of names, it produces the same output every time.

__List.js__
```jsx
class List extends React.Component {
	render() {
		return (
			<ul>
			{
				this.props.names.map(
					item => <li key={item.id}>{item.name}</li>
				)
			}
			</ul>
		)
	}
}
```

Let's assume our component receives the following props:

* `list` is a set of names
* `term` is a search term for those names

With this, we want to display only the names from the `list` that match our `term`. Let's give it a shot:

```jsx
import React from 'react';

class FilteredList extends React.Component {
	render() {
		return (
			<ul>
			{
				this.props
			}
			</ul>
		);
	}
}
```