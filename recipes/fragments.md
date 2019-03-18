# DOM Frugality: returning arrays and `React.Fragment`

One of the constraints of JSX is that you can't return two or more elements from a component's render method without wrapping them in a single parent element. Attempting otherwise will throw an error:

```jsx
function Items(props) {
  return (
    <li>Book</li>
    <li>Notebook</li>
    <li>Pen</li>
  );
}
```

> ⚠️ SyntaxError: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?

[Reading JSX as if it were JavaScript][jsx-to-js], we can tell this is invalid code:

```js
function Items(props) {
	return (
		React.createElement("li", null, "Book")
		React.createElement("li", null, "Notebook")
		React.createElement("li", null, "Pen")
	);
}
```

So the three elements need to be the children of _something_, and for a while the solution for when we do want to return a list of elements was to wrap them in an enclosing element.

## The problem with wrappers

Sometimes a wrapper element does makes sense:

```jsx
function Items(props) {
  return (
    <ul>
      <li>Book</li>
      <li>Notebook</li>
      <li>Pen</li>
    </ul>
  );
}
```

However, some HTML element types may not make sense together, and we can't find a suitable element in which to wrap our items. Other times, having an extra wrapper makes the entire structure harder to style via CSS. Further still, adding DOM elements just for the purpose of wrapping other elements to overcome a limitation in JSX can lead to an [excessive DOM size][dom-size] which may make the application slower.

> **Tip:** `document.querySelectorAll('*').length` is a quick way to count the number of DOM nodes on a page.

Ideally, we want to just be able to have a component return a list of items without a useless wrapper.

## Returning arrays and `React.Fragment`

[React 16 introduced](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html) two related features that help us avoid :

- the ability to return an array of elements from a component;
- A new element called [`React.Fragment`][fragments], which has no representation in the DOM, and whose only purpose is to wrap other elements.

We can rewrite our prior example using an array:

```jsx
function Items(props) {
  return [
    <li key="book">Book</li>,
    <li key="notebook">Notebook</li>,
    <li key="pen">Pen</li>
  ];
}
```

This version is a bit clunky. We need to add `key` props to our items to avoid React throwing a warning, separate the items with commas, and place any text nodes as quoted strings.

Having a "dummy" wrapper such as `React.Fragment` instead allows us to write terser JSX by benefiting from the `children` syntax sugar. It's akin to DOM's own [DocumentFragment][document-fragment] and serves a similar purpose. Here's how it looks:

```jsx
function Items(props) {
  return (
    <React.Fragment>
      <li>Book</li>
      <li>Notebook</li>
      <li>Pen</li>
    </React.Fragment>
  );
}
```

Problem solved!

## Conclusion

The HTML we write should match our intent as authors. Wrapper components were an implementation detail of React and JSX that was leaking to the DOM, and `React.Fragment` helps us avoid it.

[fragments]: https://reactjs.org/docs/fragments.html
[dom-size]: https://developers.google.com/web/tools/lighthouse/audits/dom-size
[jsx-to-js]: ./jsx-to-javascript.md
[document-fragment]: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
