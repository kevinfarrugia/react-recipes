# DOM Frugality: `React.Fragment` and returning arrays

One of the constraints of JSX is that you can't return two or more elements in a component without wrapping them in a single parent element:

```jsx
function Items(props) {
  return (
    <li>Book</li>
    <li>Notebook</li>
    <li>Pen</li>
  );
}
```

Attempting this will throw an error:

> ⚠️ SyntaxError: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?

[Reading JSX as if it were JavaScript](./jsx-to-javascript.md), we can tell this is invalid code:

```js
function Items(props) {
	return (
		React.createElement("li", null, "Book")
		React.createElement("li", null, "Notebook")
		React.createElement("li", null, "Pen")
	);
}
```

So the three elements need to be the children of _something_, and for a while the solution for when we do want to return a list of elements was to wrap them in an enclosing element:

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

Ideally, we want to just be able to have a component return a list of items without a useless wrapper. React 16 introduced two related features that help us avoid it:

- [`React.Fragment`][fragments], which has no representation in the DOM, and whose only purpose is to wrap a list of elements;
- the ability to return an array of elements from a component.

We can use either one instead of the element wrapper:

```jsx
// Using React.Fragment
function Items(props) {
  return (
    <React.Fragment>
      <li>Book</li>
      <li>Notebook</li>
      <li>Pen</li>
    </React.Fragment>
  );
}

// Using an array
function Items(props) {
  return [
    <li key="book">Book</li>,
    <li key="notebook">Notebook</li>,
    <li key="pen">Pen</li>
  ];
}
```

The only difference between the two is that when returning an array, we need to add `key` props to our items. But in either version, we've avoided cluttering the DOM with an useless wrapper.

[fragments]: https://reactjs.org/docs/fragments.html
[dom-size]: https://developers.google.com/web/tools/lighthouse/audits/dom-size
