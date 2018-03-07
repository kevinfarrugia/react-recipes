# An introduction to performance

Prior to getting a hang of React, I had been working as a front-end engineer for several years, and I was used to implement things by writing JavaScript code that worked with the DOM directly; adding and removing event listeners at the right moments, trying to touch the DOM as lightly and infrequently as possible. The kind of things that, while I'm grateful I got to learn how to do, now seem... quaint? with React taking care of them for you.

“So you're telling me I can just throw anything at it, and it will figure out what to update in the DOM?”  — I was especially enthusiastic about React's seeming ability to figure which parts of the DOM need updating. It was undoubtedly faster that some of the things I'd been doing to the DOM. 

It was only later that I realized that, while React is brilliant about these updates, figuring out how to minimally touch the DOM comes in fact with a price in performance. 

React does not __know__ right away that updates are not necessary. Just because you see the DOM is not updating<sup>1</sup>, it doesn't mean React has not worked hard to come to the conclusion that there's nothing to update.

Instead it offers us, the developers, __ways to decide for it__ when a component should be updated. In this section, we'll look at some things we can do to boost our app's performance.

<sup>1</sup> If you open your browser's developer tools, you'll see DOM nodes, or some of their attributes, flash when they update.