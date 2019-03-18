# Render props

[Render props][render-props] is a technique for sharing data between a component and its children. Render props are based on the ability to pass functions as props to a component.

Functions in props are usually meant as callbacks for the component to invoke. The component tells us _something has happened_. In contrast, functions that serve as render props are meant to be _rendered_ (that is, shown in the UI) by the component. So we're telling the component what to render.

## The canonical render prop: function as a child

When `children` is used as a render prop, the pattern is also called **function as a child**, and it's the one most often seen around.

## Variants

### Function as any prop

### Many functions as children

### Optional function as a prop

We can take the render prop function even further by making it optional. Our component can more flexible if it allows, but does not require, the child to be a function.

So when we use the component, we might find that the children for the component don't need anything from it, and it's shorter to write:

```jsx
// Instead of:
const App = props => {
  return <MyComponent>{data => <Child />}</MyComponent>;
};

// We could write:
const App = props => {
  return (
    <MyComponent>
      <Child />
    </MyComponent>
  );
};
```

To support this pattern of usage, `MyComponent` needs to look at whether the `children` prop contains a function and invoke it, or otherwise render the children as they are:

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

With the `optionalRenderProp` helper, the users of `MyComponent` can choose when to use the `data` and where to ignore it.

## The shape of data

We devise a contract of how the component passes data down to its children. The contract is reflected in the function signature (the number of arguments child functions receive). Astute readers will notice that if the contract states a single attribute — a `props` if you will — functions as children are indistinguishable from inline components.

So you can think of this particular subset of render props as function components defined inline, with the purpose of capturing some values from the render scope.

## How render props relate similar patterns

### Render props vs. HOC

Render props can be used instead of [Higher-Order Components](./hoc.md) when you need more flexibility. While HOCs encapsulate the way components get decorated with extra props in an inflexible way which occasionally can result in prop name collisions, render props simply expose data, and you can choose inline how to apply them to the child elements.

See Michael Jackson's article [_Use a Render Prop!_](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

### Render props vs. hooks

TODO.

## Conclusion

Render props are a way to build a component's API so that the component can pass down data to its children via function arguments.

[render-props]: https://reactjs.org/docs/render-props.html
