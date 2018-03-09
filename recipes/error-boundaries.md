# Error Boundaries

Real-world applications are never perfect. 

A component will sometimes receive data it's not expecting, or the user interacts with the component in a way it doesn't know how to handle — and the component breaks.

In previous versions of the library, a broken component would compromise React's inner state and lead to odd behavior and cryptic error messages in the browser console.

However, React 16 handles component errors a bit differently: instead of pushing through, it bails out and __removes the entire component tree from the DOM__ to prevent further damage. If your whole app is built in React, it just goes blank.

Luckily, React 16 also comes with a way to control what happens when these errors occur, with a concept called [Error Boundaries](https://reactjs.org/docs/error-boundaries.html). You may have even noticed this suggestion in the browser console whenever something breaks:

> Consider adding an error boundary to your tree to customize error handling behavior.

A potential blank screen in our app is a good reason to go ahead and consider it, if I ever saw one. So what's it all about?

## Example implementation

We're going to implement an `ErrorBoundary` component that catches any error in its children and displays a fallback UI when that happens:

![Error Boundary Demo](./assets/error-boundary.png)

```jsx

const initial_state = {
  state: null,
  info: null
};

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = initial_state;
    this.reset = this.reset.bind(this);
  }
  
  componentDidCatch(error, info) {
    this.setState({ error: error, info: info });
  }

  reset() {
    this.setState(initial_state);
  }

  render() {
    let { error, info } = this.state;
    if (error) {
      return (
        <div className='error-boundary'>
          <h1>Something went wrong 🙊</h1>
          <h2>{ error.toString() }</h2>
          <pre>
            { info.componentStack }
          </pre>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

```jsx
class FaultyComponent extends React.Component {

  constructor(props) {
    super(props);
    this.break = this.break.bind(this);
  }

  break() {
    this.setState(
      prevState => ({ counter: prevState.counter + 1 })
    )
  }

  render() {
    return (
      <div className='faulty-component'>
        <h1>Faulty Component</h1>
        <p>
          Like my human creator, I am prone to errors, 
          but I try my best to keep it cool. 
          I wouldn't push the button below if I were you, though.
        </p>
        <button onClick={this.break}>Click Me</button>
      </div>
    );
  }
}
```

```jsx
<ErrorBoundary>
  <FaultyComponent/>
</ErrorBoundary>
```

