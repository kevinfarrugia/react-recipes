# Why immutability is important

__Immutability__ is a fancy term for __not changing the properties in an object, ever__.

```js
let obj = { x: 10 };
enjoy_this_object(obj);
obj.x = 20; 
// freeze, immutability police! 🚨
```

That includes using array methods that change the array, such as `push`:

```js
let arr = [1, 2, 3];
have_these_numbers(arr);
arr.push(4);
```

Instead, whenever you want to change anything about an object, you __return a new object__:

```js
let obj = { x: 10 };
let new_obj = { ...obj, x: 20 };

let arr = [1, 2, 3];
let new_arr = [...arr, 4];
```

You may ask yourself what the big deal is. In general, changing an object you've already sent places may cause bugs that are harder to trace and areas of your apps silently falling out of sync.

But there's a more subtle reason why you want to favor immutability, especially when working with React: 

> Sending new objects whenever anything about them changes makes it easy to tell that they've changed, without having to look deep into their bowels.

This is how `React.PureComponent` tells that it needs to re-render: it looks wether any of its props have _shallowly_ changed.

## Thinking immutably

When shifting to the immutable mindset, there are a few tools on the belt:

### Updating objects 

You return a new object by extending the original object with new values, which can be done in two ways:

* the [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method, which is supported out of the box in (most) browsers, and which we can easily polyfill, or
* the newer [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), which is more elegant but needs Babel to translate into browserland.

```js
let obj = { x: 10, y: 20 };

// Using Object.assign() method...
let new_obj = Object.assign({}, obj, { y: 30 }); 

// ...or the Spread syntax
let new_obj = { ...obj, y: 30 }; 
```

When you update a value deep into the object, you `spread` your way to the property you want to update:

```js
let obj = {
	name: 'John Doe',
	occupation: 'React Novice',
	avatar: {
		type: 'gravatar',
		data: {
			email: 'johndoe@gmail.com',
			size: 100
		}
	}
};

// Let's update our user's email address using the Spread syntax
let new_email = {
	...obj,
	avatar: {
		...obj.avatar,
		data: {
			...obj.avatar.data,
			email: 'john.doe.professional@gmail.com'
		}
	}
};
```

### Updating arrays

You return a new array by using the methods that don't update the array in-place, but rather return a shallow copy of it. A few useful ones are:

* `Array.slice`
* `Array.map`
* `Array.filter`
* `Array.concat`

In contrast, keep an eye for methods that alter the array, and use immutable equivalents:

* `Array.push`, `Array.shift` and `Array.unshift` — use `Array.concat` instead
* `Array.splice` — use `Array.slice` and `Array.concat` instead
* `Array.sort` — use `Array.slice` before sorting, to sort a fresh copy instead of the original array.
* `Array.forEach` — use `Array.map` instead

When you have an array of objects, and you want to change something about one of these objects, you return a new array containing the original objects, plus the updated version of your object:

```js

let contacts = [
	{ name: 'Alice', email: "alice@gmail.com" },
	{ name: 'Bob', email: 'bob@gmail.com' },
	{ name: 'Carol', email: 'carol@gmail.com' }
];

let updated_contacts = contacts.map(
	contact => {
		if (contact.name === 'Bob') {
			return {
				...contact,
				email: "bob.new@gmail.com"
			}
		} else {
			return contact;
		}
	}
)

```

In the example above, we `map()` our way to a new array that contains:

* a new reference to the object we want to update: in our case, we return a new object for Bob, whose email address we update using the Spread syntax;
* the same reference to any object that we don't change.

## Performance

You might be concerned that embracing the immutable way of dealing with data comes with a performance penalty. Reader, you are right. Creating new objects and arrays all the time is more expensive than plain-old mutation. The popular [Immutable.js](https://facebook.github.io/immutable-js/) library tries to bring immutable structures closer to their mutable counterparts in terms of efficiency — consider using it if you're concerned about speed. But otherwise revel in this much cleaner way of dealing with data, and in the fact that by using immutable structures and [smartly-deployed `PureComponent`s](../components.md), you may actually be boosting your app's performace. 