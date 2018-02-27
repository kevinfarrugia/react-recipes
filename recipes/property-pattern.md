# The `property` pattern for callbacks

## The gist

When each item in a set of components emits some event, use the `property` pattern to know from which item the event originates, all the while passing a common callback function, instead of creating several separate, item-bound callbacks.

## The motivation

A common scenario is to have lists of items with actions associated to each item. A typical example is the infamous _To Do List_, where you have a checkbox next to each item to mark it as _done_.

When you need to change the state in the parent component in response to an action triggered by one of its children, you'll quickly find yourself in a bind (te-hee) — technically, you'll need to pass a separate callback function to each item so that you can later tell which item is the source of the action. 

In fact, [the React docs recommend](https://reactjs.org/docs/handling-events.html) `bind`-ing the callback function to each item separately. It's a bit like Oprah going [_you get a callback! you get a callback!_](https://www.youtube.com/watch?v=hcJAWKdawuM):

```jsx
class List extends React.Component {

  render() {
    let { todos } = this.props;
    return (
      <ul>
        { 
          todos.map(todo => 
            <li 
              key={ todo.id }
              onClick={ this.markAsDone.bind(this, todo.id) }
            >
              { todo.label }
            </li>
          )
        }
      </ul>
    );
  }

  markAsDone(id) {
    // Mark the item with the passed id as "done".
  }
}
```

This solution, while straightforward, comes with the drawback that every time the parent re-renders, the children always get _different functions_ as their `onClick` callback. In turn, this will cause unnecessary DOM operations (React needs to constantly remove the old callbacks and add in the new ones). 

Depending on your app's complexity, this may or may not matter. And in the case of simple DOM elements, there isn't much of an alternative to this method.

But for custom components that you write yourself, using callbacks this way comes with [drawbacks of its own](./purecomponent-caveats.md). 

### The approach

To address the drawbacks of the `bind` method, I like to use what I call the `property` pattern.

> Make your components accept an optional `property` prop that gets passed back with all callbacks originating from the component.

With this pattern we can simply write:

```jsx
render() {
  let { items } = this.props;
  return (
    <List>
      { 
        items.map(item => 
          <Item 
            key={item.id}
            property={item.id}
            onClick={this.removeItem}
          >
            {item.label}
          </Item>
        )
      }
    </List>
  );
}

removeItem(id) {
  // remove item with the passed id
}
```

For it to work, our `Item` component will need to accept a `property` prop to pass along to callbacks:

```jsx
class Item extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.property);
  }

  render() {
    return (
      <li onClick={this.onClick}>{this.props.children}</li>
    );
  }
}
```

When you apply this pattern across several components, it makes it easy to bind each of them to different parts of the state, such as in the example below, which maps different types of UI controls to values in the state:

```jsx
  render() {
    return (
      <div className='editor'>

        <Slider 
          value={this.state.slidervalue} 
          property={slidervalue}
          onChange={this.update}
        />

        <List
          value={this.state.listvalue}
          property={listvalue}
          onChange={this.update}
        />

        { // ... etc ... }
      </div>
    )
  }

  update(value, prop) {
    this.setState({
      [prop]: value
    });
  }
```