import React from 'react';

import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      info: null
    };

    this.reset = this.reset.bind(this);
  }
  
  componentDidCatch(error, info) {
    this.setState({
      error: error,
      info: info
    });
  }

  reset() {
    this.setState({
      error: null,
      info: null
    });
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

export default ErrorBoundary;