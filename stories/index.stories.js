import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

class Lifecycle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		action('constructor')();
	}

	render() {
		action('render')();
		return <div style={ {padding: '1em', background: "#f0f0f0", border: '1px solid #000', margin: '1em 0'} }>
			<h3>Component</h3>
			<button onClick={() => { this.setState({ bar: Math.random() }) }}>Change state</button>
		</div>;
	}

	componentWillMount() {
		action('componentWillMount')();
	}

	componentDidMount() {
		action('componentDidMount')();
	}

	componentWillUnmount() {
		action('componentWillUnmount')();
	}

	componentWillUpdate() {
		action('componentWillUpdate')();
	}

	componentDidUpdate() {
		action('componentDidUpdate')();
	}

	shouldComponentUpdate() {
		action('shouldComponentUpdate')();
		return true;
	}

	componentWillReceiveProps() {
		action('componentWillReceiveProps')();
	}
}

class LifecycleWrapper extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mounted: true
		};
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={() => { this.setState({ mounted: true })}}>Mount Component</button>
					<button onClick={() => { this.setState({ mounted: false })}}>Unmount Component</button>
					<button onClick={() => { this.setState({ foo: Math.random() })}}>Change Prop</button>
				</div>
				{ this.state.mounted && <Lifecycle foo={this.state.foo}/> }
			</div>
		);
	}
}

storiesOf('Lifecycle', module)
  .add('Lifecycle methods', () => {
  	return <LifecycleWrapper/>;
  });
