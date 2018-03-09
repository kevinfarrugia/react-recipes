# Error Boundaries

Real-world applications are never perfect. 

A component will sometimes receive data it's not expecting, or the user interacts with the component in a way it doesn't know how to handle — and the component breaks.

In previous versions of the library, a broken component would compromise React's innards and make it behave oddly, along with cryptic error messages in the browser console. However, React 16 handles component errors a bit differently: instead of pushing through, it bails out and __removes the entire component tree from the DOM__ to prevent further damage. 

If your whole app is built in one React piece, it just... goes blank.

Luckily, React 16 also comes with a way to control what happens when these errors occur, with a concept called [Error Boundaries](https://reactjs.org/docs/error-boundaries.html). In fact, you may have noticed this suggestion in the browser console whenever something breaks:

> Consider adding an error boundary to your tree to customize error handling behavior.

A potential blank screen sounds like reason enough to quite go ahead and do consider it. So what's it all about?

## The `componentDidCatch` lifecycle method

React 16 introduced a new component [lifecycle method](./lifecycle-methods.md) by the name of [`componentDidCatch`](https://reactjs.org/docs/react-component.html#componentdidcatch). It gets called any time an unhandled error occurs in one of the component's children. When a component implements a `componentDidCatch` method, it becomes an __Error Boundary__. It's called _boundary_ because it stops the errors from bubbling further up the component tree and wreaking havoc throughout the entire app.

So do we add the `componentDidCatch` method to all our components?

Not quite. A component cannot safely catch errors that happen inside _itself_, much like we can't catch ourselves when we're falling. Instead, __it only catches errors from any of its children__, or its childrens's children, and so on — anything further down the component tree. 

What we want to do instead is create a component whose only purpose is to act as an Error Boundary, whenever we may need it:

```jsx
// Our ErrorBoundary component...
class ErrorBoundary extends React.Component {

  componentDidCatch(error, info) {
    // TODO: do something about the error
  }

  render() {
    return this.props.children;
  }
}

// ...and how we'd use it to wrap a vulnerable component
<ErrorBoundary>
  <FaultyComponent/>
</ErrorBoundary>
```

With this in place, any time our `FaultyComponent` goes haywire, the `ErrorBoundary`'s `componentDidCatch` method will be called, with the following parameters:

* `error` is the [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object;
* `info` is an object from which we can read the `componentStack` string.

### What gets caught by `componentDidCatch`, and what doesn't

The Error Boundary will catch __errors that happen inside any of its descendants' lifecycle methods__, including their `render` method and their `constructor`. 

Some errors are __not__ caught in:

* asynchronous code like the one inside `setTimeout` or `requestAnimationFrame` callbacks
* event handlers
* server-side rendering

And, as mentioned earlier, it doesn't catch errors within itself. Rather, when [the boundary itself throws an error](https://twitter.com/_youhadonejob1), the error gets bubbled to the next closest Boundary up the component tree.

Errors in asynchronous code event handlers don't _need_ to be caught in Error Boundaries because they won't affect React. You can, however, use the regular JavaScript `try / catch` construct if you really want to handle those as well.

### What to do about errors

Error boundaries are useful for:

* Sending the errors to a service that can store them for you, to keep track of the troubles your users might be having with the app.
* Showing some sort of __Fallback UI__ instead of the broken component.

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

