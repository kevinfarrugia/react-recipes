# The `property` pattern for callbacks

## The gist

When each item in a set of elements accepts some callback, use the `property` pattern to know which item the callback comes from, all the while passing a single, shared function, instead of creating several separate, item-bound callbacks.

## The motivation

A common scenario is to have lists of items with actions associated to each item. A typical example is the (in)famous _To Do List_, where you have a checkbox next to each item to mark it as _done_.

When the parent component's state needs to be updated in response to an action triggered by one of its children, we'll quickly find ourselves in a bind (\*cough\*) — technically, we'll need to pass a separate callback function to each item so that we can later tell which item the action originated from. The React docs on handling events [themselves suggest](https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers) `bind`-ing the callback function to each item separately:

```jsx
class ToDoList extends React.Component {

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

My brain's stuck on Oprah going [_You get a callback! You get a callback!_](https://www.youtube.com/watch?v=hcJAWKdawuM) every time I do this.

The solution, while straightforward, has the drawback that every time the parent renders, the children get _new functions_ as their `onClick` callback. For simple DOM elements, this will cause useless DOM operations, as React needs to constantly remove the old callbacks and add in the new ones. And for class components, using callbacks this way comes with [drawbacks of its own](./purecomponent-caveats.md).

It won't hurt performance too much to use `bind` on plain DOM elements. And if it does become an issue, you can [use `data` attributes](https://reactjs.org/docs/faq-functions.html#example-passing-params-using-data-attributes) to alleviate it.

Let's see if we can make similar performance optimizations for class components.

## The approach

To address the drawbacks of the `bind` technique we can use something I call _the `property` pattern_<sup>1</sup>.

> Make your components accept an optional `property` prop that gets passed back with all callbacks originating from the component.

With this pattern we can simply write:

```jsx
class ToDoList extends React.Component {

  render() {
    let { todos } = this.props;
    return (
      <ul>
        { 
          todos.map(todo => 
            <Todo 
              key={todo.id}
              property={todo.id}
              onClick={this.markAsDone}
            >
              {todo.label}
            </Todo>
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

For it to work, our `Todo` component will need to accept a `property` prop to pass along to callbacks:

```jsx
class Todo extends React.PureComponent {

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

When you use the `property` pattern across several components, it makes it easy to bind each of them to different parts of the state, such as in the example below, which maps different types of UI controls to values in the state:

```jsx
class Editor extends React.Component {

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
    );
  }

  update(value, prop) {
    this.setState({
      [prop]: value
    });
  }

}
```

---

<sup>1</sup> I coined the term since I haven't found references to this technique, but I'd love to know if it's called something different.
