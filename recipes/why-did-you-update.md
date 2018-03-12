# `why-did-you-update` is your new best friend

Try as you might to make your components as performant as possible — and no, that [doesn't mean making all your components `PureComponent`s](./purecomponent-caveats.md) — it's quite possible you missed a few spots. Why not accept a helping hand from your new friend, [`why-did-you-update`](https://github.com/maicki/why-did-you-update)?

`why-did-you-update` is a small library that you wrap over React while you're developing that lets you know when a component has re-rendered uselessly. 

## Setting it up

You install it with NPM:

```sh
npm install --save why-did-you-update
```

...or Yarn, if you prefer:

```sh
yarn add why-did-you-update
```

Then, in your code, you call it on your React library:

```js
import React from 'react';
const { whyDidYouUpdate } = require('why-did-you-update');
whyDidYouUpdate(React);
```

__But be careful!__ You don't want to ship this into production, so you'll need to tell you're in _development mode_ one way or another, and only enable it as necessary:

```js
import React from 'react';
if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
```

With these few lines of code, your React is all wired up for `why-did-you-update` to let you know in your __browser's console__ whenever a component can potentially be optimized.

## Reading the output

1. Do something in your app to trigger a change;
2. Observe a river of components flowing in your browser's console;
3. Go through [the five stages of grief](https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model#Stages_of_grief) in quick succession.

Confronting your less than ideal job of ensuring your components don't re-render all over the place can feel both terrifying and liberating, but mostly the latter: it ultimately gives you a chance to squeeze out more performance out of your app! (That's what I always tell myself.)

Here are some of the things `why-did-you-update` lets you know about about your components that have re-rendered

### Even though none of their props or state changed

> Value is the same (equal by reference). Avoidable re-render!

When `props` or `state` as a whole stays the same, meaning the new reference points to the same object as teh old one, but the component still re-renders, consider using a `PureComponent` if appropriate.

### When their props / state changed, but not really

> Value did not change. Avoidable re-render!

Something in the `props` or `state` has changed its reference, although on a __deep__ rather than shallow compare, it turns out it still contains the same data.

Numbers, strings and the such will always be equal themselves:

```js
1 === 1; // true
'foo' === 'foo'; // true
null === null; // true
undefined === undefined; // true
```

Others may have the "same" value but a different reference, in particular __objects__ and __arrays__:

```js
[] === []; // false
{ name: 'Dan' } === { name: 'Dan' }; // false
```

In the case of objects, see whether it makes sense to spread out the object to individual props rather than passing it as a single prop.

I discuss arrays in [a separate article](./arrays-as-props.md).

The library helpfully points out which of the properties are deep-equal but now shallow-equal.

### When the only thing that changed are functions

> Changes are in functions only. Possibly avoidable re-render?

Functions are another thing that may [trip up our performance enhancements](./purecomponent-caveats.md). Since there are legitimate reasons for passing a new function to a component, the suggestion is phrased with a question mark. But most of the time, new functions are accidental and can be fixed.

First off, make sure you're [not `bind`-ing a function in place](./property-pattern.md):

```jsx
<Component onClick={this.handleClick.bind(this)}/>
```

...and in the more general sense look for ways to cache the reference to that function, if it does not fundamentally change between renders.

## What it can't tell you

While `why-did-you-update` already offers you a lot to work with, it has some caveats:

* It can't tell that functional components (components defined as plain functions) have updated uselessly ([issue](https://github.com/maicki/why-did-you-update/issues/10)). But functional components update uselessly most of the time, so consider [avoiding them](./components.md) if you're concerned about their performance.
* It doesn't work with components that have a custom `componentDidUpdate` method ([issue](https://github.com/maicki/why-did-you-update/issues/17));

### Changes in props or state that don't have an effect on the DOM output

Another thing that the library can't identify yet is when the component re-renders due to a change in the `props` or `state`, but the component's DOM stays the same.

It _might_ be a sign you're putting things in `props` or `state` that you actually don't need for rendering the component. If that's the case, you can prune them out or [store them in a different place](./derived-data.md).