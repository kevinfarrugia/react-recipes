# An introduction to performance

Prior to getting a hang of React, I had been working as a front-end engineer for several years and was used to implement things by writing JavaScript code that worked with the DOM directly. Adding and removing event listeners at the right moments, trying to touch the DOM as lightly and infrequently as possible, sending data back and forth, and generally doing my best to not turn it all in one big mess.

The kind of things that, while I'm grateful I had the chance to learn how to do, now seem... quaint? with React taking care of them for you.

_“So you're telling me I can just throw anything at it, and it will figure out what to update in the DOM?”_

I was especially enthusiastic about React's knack for figuring which parts of it need updating. It was obviously faster that some of the nastier things I'd been doing to the DOM. 

It was only later that I realized that while React is brilliant about these updates, a process which is called [reconciliation](https://reactjs.org/docs/reconciliation.html) figuring out how to minimally touch the DOM comes in fact with a price in performance. 

React does not __know__ right away that some updates are useless, in that they don't effect any change on the DOM. Just because you don't see it updating<sup>1</sup>, it doesn't mean React hasn't worked hard to come to the conclusion that there's nothing to update.

Instead it relies on us to __tell it__ when a component should update — or rather, when it shouldn't. 

So in this section, we'll look at some things we can do to boost our app's performance, and what to look out for when writing performance-conscious code.

Before we get to it, read the [Optimizing Performance](https://reactjs.org/docs/optimizing-performance.html) guide from the React website.

---

<sup>1</sup> If you open your browser's developer tools, you'll see DOM elements, or some of their attributes, flash as they're getting updated.