# The Context API

React components normally talk only when they're in a parent-child relationship. Parents pass down props to their children, and children talk back to their parents via callback functions they receive as props.

Passing a prop several levels down in the component tree, from a component to its grandchild, or grand-grandchild, requires the collaboration of all the components along the way: we repeatedly pass the prop from parent to child, until in reaches the destination. (This is sometimes called _prop drilling_.)

```jsx
class Grandma extends React.Component {
  render() {
    <Mother></Mother>
  }
}
```

This is fine for a while, but can become tedious. Furthermore, it's impossible to pass through components that return `false` in their `shouldComponentUpdate` method for a particular update: the prop drilling stops in its track.

The [Context API](https://reactjs.org/docs/context.html), unveiled in React 16.3, is a way to pass some pieces of state across whole swathes of the component tree, through a separate pathway that is unencumbered by normal component lifecycle methods.

We'll create a context for each piece of information we want to share with several components. We do this with the `React.createContext()` method. Let's take, as an example, an application's theme:

```js
import React from 'react';

const ThemeContext = React.createContext();
// Note: the method can also take a `defaultValue` argument
// but we'll ignore it for now, since it doesn't mean 
// what we'd expect it to mean.
```

Contexts will usually live in their own files that can then be imported whenever we need them.

__contexts/ThemeContext.js__
```jsx
import React from 'react';

const ThemeContext = React.createContext();

export default ThemeContext;
```

`ThemeContext` is a Context object that offers two special React components: a `Provider` and a `Consumer`. We access them as `ThemeContext.Provider` and `ThemeContext.Consumer`, and use them as we would normal React components in JSX.

Placing these components in our app — remembering to place the `Provider` somewhere _above_ the `Consumer` in the component tree — allows them to talk to one another.

__Application.js__

```jsx
import React from 'react';

// import the theme context object
import ThemeContext from './contexts/ThemeContext';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      theme: 'light'
    };
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <Toolbar />
        <Content>
          <ThemeContext.Consumer>
          {
            value => <Sidebar theme={value} />
          }
          </ThemeContext.Consumer>
        </Content>
      </ThemeContext.Provider>
    );
  }
}

```

A few things are happening here:

Assuming we need to know the current theme in a myriad of places across our app, we wrap everything in `ThemeContext.Provider`, so that we can potentially use `ThemeContext.Consumer` anywhere in our component tree. We set the single prop accepted by the Provider, `value`, to a value from the application's state. Always remember to pass the `value` prop, as ommitting it will make it `undefined` inside the Consumers! 

Somewhere down the road, a `ThemeContext.Consumer` 

The Consumer accepts a single child as a function (this is an example of the Render Prop pattern TODO link). The function will receive the `value` from the Provider as its only argument.


When deciding whether to update its consumers, the `Provider` will check whether its value has changed with the `Object.is` comparison. We can think about it as mostly a strict equality: 

```js
// this...
Object.is(objectA, objectB);

// is mostly the same as:
objectA === objectB;
```

(To learn more about the subtle differences between `Object.is` and `===`, check out this TODO)

When the `Provider`s `value` prop changes, all its descendant `Consumer`s will get updated, regardless of whether between the Provider and the Consumer there's a component that returns `false` from its `shouldComponentUpdate` lifecycle methods. 

### When do Providers and Consumers re-render?

Whenever a `render()` method that contains a Provider component is invoked, the Provider, and the whole tree underneath it, get re-rendered, regardles of whether its `value` prop has changed or not, through the normal React flow of things.

If the `value` prop changes, and even if down the tree there's a component that returns `false` from its `shouldComponentUpdate` lifecycle method, Consumer components further down still get updated. (We mentioned earlier that Provider and Consumer have a separate way of communicating that is not related to the normal React flow). The Provider really, really, wants to update its Consumers no matter what. 

### How can a Consumer talk back to its Provider?

All that a Consumer gets from its Provider is the content of the Provider's `value` prop, so for the Consumer to alter values in the context, we need to pass a function in the `value` that can update the context.

(For the sake of brevity, I'm ommitting any intermediate components that may lay between the Provider and the Consumer. Imagine they are far, far away from each other in the component tree.)

```jsx

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.state = {
      theme_context: {
        theme: 'light',
        toggleTheme: this.toggleTheme
      }
    }
  }

  toggleTheme() {
    this.setState(current_state => {
      theme_context: {
        ...current_state.theme_context,
        theme: current_state.theme_context.theme === 'light' ? 'dark' : 'light'
      }
    })
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme_context}>
        ...
        <ThemeContext.Consumer>
          {
            value => 
              <Sidebar 
                theme={value.theme} 
                toggleTheme={value.toggleTheme}
              />
          }
        </ThemeContext.Consumer>
        ...
      </ThemeContext.Provider>
    )
  }
}
```

Let's figure out what everything does. 

First of all, let's look at what we're setting as a `value` to the Provider: we want to include, along with the `theme`, a callback `toggleTheme` with which to toggle the application's theme from within the Consumer.

We might be tempted to pass it as:

```jsx
  <ThemeContext.Provider
    value={
      {
        theme: this.state.theme,
        toggleTheme: this.toggleTheme
      }
    }
  >
    ...
```

But by doing this, we're creating a _new_ object each time the render() method of our application is invoked, and needlessly update all the Consumers, regardless of whether the theme changed or not. And remember, Consumers are immune to PureComponent / shouldComponentUpdate optimizations, so we really don't want to do this.

Instead we package everything we want to pass our Provider into the state, under the `theme_context` key. This way, the object we pass as the Provider's `value` stays the same as long as we don't alter it.

The second thing to notice is we're passing the `toggleTheme` callback function to the Provider, and this function is able to change the `theme` value from the context, by calling `setState` on the Application component.

### What to put in a context and where to put it

Contexts are designed to be a fast way of sending changes to various parts of the application. As such, they only have a single `value` that they can pass to their Consumers.

We need to keep contexts specific, and only put in a context things that always go together.

However, if some component inside our component tree needs things from many Providers, it can get a bit unwieldly:

```jsx
  <ThemeContext.Consumer>
    {
      theme =>
        <UserContext.Consumer>
        {
          user => 
            <MyComponent user={user} theme={theme} />
        }
        </UserContext.Consumer>
    }
  </ThemeContext.Consumer>
```

To go around this, we can apply the _render prop_ pattern to combine the Consumers:

```jsx
const ThemeAndUserConsumer = (props) =>
  <ThemeContext.Consumer>
    {
      theme =>
        <UserContext.Consumer>
        {
          user => 
            props.children({ user, theme });
        }
        </UserContext.Consumer>
    }
  </ThemeContext.Consumer>

// then use it with MyComponent
<ThemeAndUserConsumer>
  ({ user, theme }) => <MyComponent user={user} theme={theme} />
</ThemeAndUserConsumer>
```

### TODO

* Higher order component to avoid tedium

