# `why-did-you-update` is your best friend

Try as you might to make your components as performant as possible — and no, that [doesn't mean just making all your components `PureComponent`s](./purecomponent-caveats.md) — it's quite possible you missed a few spots. Why not accept a helping hand from your new friend, [`why-did-you-update`](https://github.com/maicki/why-did-you-update)?

`why-did-you-update` is a small library that you wrap over React while you're developing that lets you know when a component has re-rendered uselessly. 

## Setting it up

You install it with NPM:

```shell
npm install --save-dev why-did-you-update
```

...or Yarn, if you prefer:

```shell
yarn add --dev why-did-you-update
```

Then, in your code, you call it on your React library:

```js
import React from 'react';
const { whyDidYouUpdate } = require('why-did-you-update');
whyDidYouUpdate(React);
```

with these few lines of code, your React is all wired up for `why-did-you-update` to let you know in your browser's console whenever a component can potentially be optimized.

__Careful!__ You don't want to ship this into production, so you'll need to tell you're in _development mode_ one way or another, and only enable it as necessary:

```js
import React from 'react';
if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
```

