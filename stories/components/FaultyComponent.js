import React from 'react';

import './FaultyComponent.css';

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

export default FaultyComponent;