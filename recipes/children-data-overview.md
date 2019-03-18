# Passing data to children: an overview

We tell components what to render all the time: passing children to components is one of the basic ways to compose our application's element tree.

When a custom component receives children, you'll likely want it to render the children as they are. This is how native DOM elements work — you can nest them at will. So it's only natural custom components do the same:

```jsx
const MessageBox = props => <div class="message">{props.children}</div>;
```

In the example above, the `MessageBox` component wraps whatever it gets as children in a `<div>`. It does not particularly care what children it has to render.

But what about the odd case where the component would like to pass down some data to its children? This section reviews the different ways we can do that. They're all related, but come with their own pros and cons.

## Extending children with `React.Children` and `React.cloneElement`

[**Extending children with `React.Children` and `React.cloneElement`**](./recipes/extending-children.md)

## Higher-Order Components

[Higher-Order Components](./hoc.md)

## Render Props

[Render Props](./render-props.md)
