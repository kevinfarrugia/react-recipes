# `React.PureComponent` caveats

When used appropriately, pure components can boost your application's performance by avoiding useless renders. A pure component performs a _shallow comparison_ of its `props` and `state` against their previous values and skips the re-render if nothing has (shallowly) changed.

This shallow comparison is reasonably fast, and definitely faster than a re-render. But it's still a cost, and in some cases, you may find that some prop has surprisingly changed even though it didn't look like it. The pure component does the shallow comparison, and then re-renders anyways, and you get the worst of both worlds.

You're mostly sheltered if your component receives simple props such as strings, booleans, or numbers. Things get trickier when there are functions, objects, arrays and React elements involved.

Here are some cases I've stumbled upon that negate the benefit of using a pure component:

### Sending functions (callbacks) to a component

When the component receives a function as a prop, make sure its parent is not constantly sending new functions, as can happen with defining anonymous functions or `bind`-ing functions in-place. Let's say we have the following components:

```jsx
class Snow extends React.PureComponent {
  render() {
    <div className="snow" onClick={this.props.onClick} />;
  }
}
```

But then the parent component does:

```jsx
class SnowGlobe extends React.Component {
	render() {
		return (
			<Snow
				onClick={
					e => console.log(e);
				}
			/>
		);
	}
}
```

Here, because we create an anonymous function inside `SnowGlobe`'s `render()` method, our `Snow` component will get a fresh new function each time `SnowGlobe` re-renders, and will itself re-render. Same with `bind`-ing the function in-place:

```jsx
class SnowGlobe extends React.Component {
  log(e) {
    console.log(e);
  }

  render() {
    return <Snow onClick={log.bind(this)} />;
  }
}
```

For a solution to this, see [the `property` pattern for callbacks](./property-pattern.md).

### Sending React elements

When you send React elements on any prop, including `children`, will cause a re-render in the pure component. That's because [JSX resolves to JavaScript](./jsx-to-javascript) and when you're doing:

```jsx
const App = props => (
  <PureComponent>
    <h1>So pure</h1>
  </PureComponent>
);
```

`PureComponent` will receive this as the `children` prop:

```js
	{
		type: 'h1',
		props: {
			children: 'So pure'
		}
	}
```

And these JavaScript objects are not equal by reference, even though they have the same content.

### Having children

It's not just React elements as `children` that cause problems. Any time you have _more than one child_ to a component, it will cause the component to re-render each time. For example:

```jsx
const App = props => <PureComponent>Sum: {1 + 1}</PureComponent>;
```

Here, the `children` prop is `['Sum: ', 1 + 1]`, and arrays, much like objects, are not shallowly equal even if they contain the same elements. And again, the pure component re-renders.

### You're not sending what you think you're sending

Let's assume you have a list and a little piece of UI that is shown when there are no items to display:

```jsx
class List extends React.Component {
  render() {
    return (
      <div className="list">
        <ul>
          {this.props.items.map(item => (
            <li>...</li>
          ))}
        </ul>
        <PureMessage hidden={this.props.items.length} />
      </div>
    );
  }
}
```

everything works as expected and `PureMessage` only shows up when there are no items, but inspecting things with React Dev Tools you notice it's re-rendering more often than expected. What gives?

You're sending a number to the `hidden` prop, even though it looks like it should be a boolean. But everything worked, and you hadn't noticed. It's just that `PureMessage` silently got re-rendered each time an item was added to the list.

The easiest way to fix this is to [add the prop to the `propTypes` definition](./proptypes.md), and React will let you know you're setting a value of the wrong type to the prop.

Other inferred booleans spotted in the wild:

```js
// when `enabled = true`, resolves to the length of the array.
let should_display = enabled && arr.length;
```
