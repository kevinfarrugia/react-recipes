# Why immutability is important

__Immutability__ is a fancy term for __not changing the properties in an object, ever__. 

In JavaScript, we're used to changing objects all the time:

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

Instead, what if whenever you want to change anything about an object, you __return a new object__, with the changes in it? 

```js
let obj = { x: 10 };
let new_obj = { ...obj, x: 20 }; // immutabile

let arr = [1, 2, 3];
let new_arr = [...arr, 4]; // Also immutable
```

You'll naturally ask yourself why you'd want to favor this unfamiliar way of doing things. 

It's a bit like having too many cooks making a dish. Changing an object you've already sent places, or  from several places on a whim, may cause bugs that are harder to trace and areas of your apps silently falling out of sync.

But there's a more subtle reason why you want to favor immutability, especially when working with React: 

> Sending new objects whenever anything about them changes makes it easy to tell that they've changed, without having to look deep into their bowels.

It's faster to tell that `obj !== new_obj` than figuring out if anything inside the object has been altered.

This is how `React.PureComponent` tells that it needs to re-render: it looks wether any of its props have _shallowly_ changed by comparing the stored values with the newly-received values, which is a fast way of avoiding useless renders.

## Thinking immutably

When shifting to the immutable mindset, we need to drop some of our old habits and embrace some new ones.

### Updating objects 

Whenever you want to change the value of a property in an object, instead of doing `obj.some_property = new_value`, you return a new object by extending the original object and adding in the new value.

This can be done in two main ways:

* the [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method, which is supported out of the box in (most) browsers, and which we can otherwise easily polyfill, or
* the newer [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), which is more elegant but needs Babel to translate it for browsers; (in fact, what it does is it changes the spread syntax equivalent `Object.assign` calls.)

The two methods are shown below:

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

...or, of course, use the `Object.assign()` equivalent.

### Updating arrays

In JavaScript, array methods work by either returning a new array, or update the array in-place. To work immutably, we need to stick to the former, and find immutable equivalents to the latter. 

Out of the immutable methods, you'll mostly be using:

* [`Array.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
* [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
* [`Array.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
* [`Array.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

In contrast, keep an eye for methods that change the array in-place, and use immutable equivalents:

[`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) and [`Array.unshift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) add elements to the array. Instead, you can use `Array.concat`:

```js
let arr = [1, 2, 3];

// Instead of...
arr.push(4);

// ...do
let new_arr = arr.concat([4]); // or [...arr, 4]

// Instead of...
array.unshift(0);

// ...do
let new_arr = [0].concat(arr) // or [0, ...arr];
```

[`Array.pop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop), [`Array.shift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift), and [`Array.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) are used to remove elements from an array. Use `Array.slice` and `Array.concat` to obtain the same result:

```js
let arr = [1, 2, 3, 4, 5];

// Instead of...
arr.pop();

// ...do
let new_arr = arr.slice(0, arr.length - 1);

// Instead of...
arr.shift();

// ...do
let new_arr = arr.slice(1);

// Instead of...
arr.splice(index);

// ...do
let new_arr = arr.slice(0, index).concat(arr.slice(index + 1))

// Instead of...
arr.splice(index, 1, value);

// ...do
let new_arr = arr.slice(0, index).concat([value], arr.slice(index))
```


* [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sorts the values in-place. Use `Array.slice` to sort a fresh copy instead of the original array:

```js
let arr = [3, 2, 1];

// Instead of...
arr.sort();

// ...do
let new_arr = arr.slice().sort();
```

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

In the example above, we `map` our way to a new array that contains:

* a new reference to the object we want to update: in our case, we return a new object for Bob, whose email address we update using the Spread syntax;
* the same reference to any object that we don't change.

## Performance

You might be concerned that embracing the immutable way of dealing with data comes with a performance penalty. Reader, you are right. 

Creating new objects and arrays all the time is more expensive than plain-old mutation. The popular [Immutable.js](https://facebook.github.io/immutable-js/) library tries to bring immutable structures closer to their mutable counterparts in terms of efficiency — consider using it if you're concerned about speed. 

But otherwise revel in this much cleaner way of dealing with data, and in the fact that by using immutable structures and [smartly-deployed `PureComponent`s](./components.md), you may actually be boosting your app's performace. 