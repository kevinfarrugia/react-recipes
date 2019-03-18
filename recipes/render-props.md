# Render props

[Render props][render-props] is a technique for sharing data between a component and its children. Render props are based on the ability to pass functions as props to a component.

Functions in props are usually meant as callbacks for the component to invoke. The component tells us _something has happened_.

In contrast, functions that serve as render props are meant to be _rendered_ (that is, shown in the UI) by the component. So we're telling the component what to render.

## The canonical render prop: function as a child

When `children` is used as a render prop, the pattern is also called **function as a child**, and it's the one most often seen around.

## Variation: function as any prop

## Optional function as a prop

We can take the render prop function even further by making it optional. Our component can more flexible if it allows, but does not require, the child to be a function.

So when we use the component, we might find that the children for the component don't need anything from it, and it's shorter to write:

```jsx
// Instead of:
<MyComponent>
	{ data => <Child/> }
</MyComponent>

// We could write:
<MyComponent>
	<Child/>
</MyComponent>
```

To support this pattern of usage, the component needs to look at whether the `children` prop contains a function and invoke it, or otherwise render the children as they are:

```jsx
const MyComponent = props => {
  const data = {
    foo: bar
  };
  return (
    <div className="my-component">
      {optionalRenderProp(props.children, data)}
    </div>
  );
};

function optionalRenderProp(prop, data) {
  return typeof prop === "function" ? prop(data) : prop;
}
```

The `optionalRenderProp` helper looks at the value of a prop, and if it's a function, invokes it with some data, otherwise it returns the prop as-is.

[render-props]: https://reactjs.org/docs/render-props.html
