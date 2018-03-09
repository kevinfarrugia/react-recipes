import React from 'react';
import EventListener from 'react-event-listener';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ErrorBoundary from './components/ErrorBoundary';
import FaultyComponent from './components/FaultyComponent';

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

class Movable extends React.Component {

	constructor(props) {

		super(props);

		// setup the component's initial state 
		this.state = {
			x: 0,
			y: 0,
			moving: false
		};

		// bind the event listeners
		this.startMove = this.startMove.bind(this);
		this.doMove = this.doMove.bind(this);
		this.endMove = this.endMove.bind(this);

	}

	startMove() {
		// setting this on the state will render <EventListener/>
		this.setState({ moving: true });
	}

	doMove(e) {
		this.setState({
			x: e.clientX,
			y: e.clientY
		});
	}

	endMove() {
		// setting this on the state will unrender <EventListener/>
		this.setState({ moving: false });
	}

	render() {

		let {
			moving,
			x,
			y
		} = this.state;

		let style = {
			position: 'absolute',
			width: '100px',
			height: '100px',
			background: 'red',
			left: `${x}px`,
			top: `${y}px`
		};

		return (
			<div onMouseDown={this.startMove} style={style}>
				{ 
					moving && 
						<EventListener 
							target='document' 
							onMouseMove={this.doMove}
							onMouseUp={this.endMove}
						/>
				}
			</div>
		);
	}
}

storiesOf('Lifecycle', module)
	.add('Lifecycle methods', () => <LifecycleWrapper/>);

storiesOf('EventListener', module)
	.add('Movable div', () => <Movable/>);

storiesOf('ErrorBoundary', module)
	.add('ErrorBoundary and FaultyComponent', () => {
		return (
			<ErrorBoundary>
				<FaultyComponent/>
			</ErrorBoundary>
		);
	})
