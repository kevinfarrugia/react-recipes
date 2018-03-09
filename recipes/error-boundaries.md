# Error Boundaries

## Example implementation

We're going to implement an `ErrorBoundary` component that catches any error in its children and displays an `ErrorUI` when it happens.

```jsx
class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: ''
    };
  }
  
  componentDidCatch(error, info) {
    this.setState({
      error: error,
      info: info
    });
  }

  render() {
    let { render } = this.props;
    let { error, info } = this.state;
    if (error) {
      return render({ error, info });
    }
    return {this.props.children};
  }
}
```

We're using the [`render` prop pattern](./render-prop-pattern.md) to tell the `ErrorBoundary` component what to display when an error happens.

```jsx
<ErrorBoundary render={ props => <ErrorUI {...props} /> }>
  <MyComponentThatCouldBreak/>
</ErrorBoundary>
```

```jsx
const ErrorUI = ({ error, info }) => 
  <div>
    <h1>Something went wrong 🙊</h1>
    <div>
      <strong>{ error.toString() }</strong>
    </div>
    <div>
      { info.componentStack }
    </div>
  </div>
```