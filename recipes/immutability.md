# Why immutability is important

__Immutability__ is a fancy term for __not changing the properties in an object__.

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
let new_arr = arr.concat([4]);
```

You may ask yourself what the big deal is. In general, changing an object you've already sent places may cause bugs that are harder to trace and areas of your apps silently falling out of sync.

But there's a more subtle reason why you want to favor immutability, especially when working with React: 

> Sending new objects whenever anything about them changes makes it easy to tell that they've changed, without having to look deep into their bowels.

This is how `React.PureComponent` tells that it needs to re-render: it looks wether any of its props have _shallowly_ changed.