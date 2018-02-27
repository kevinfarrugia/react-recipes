# Event handling outside the component

A component sometimes needs to listen to events on DOM nodes outside its scope, most frequently on either `document` or `window`. Instead of managing the events manually, via `addEventListener` and `removeEventListener`, we can use the small [`react-event-listener`](https://github.com/oliviertassinari/react-event-listener) library to handle them in a way that feels more natural to React, clearer, and less error-prone. 

Take this simple component which you can move with your mouse:

```jsx
import EventListener from 'react-event-listener';

const initial_state = {
	x: 0,
	y: 0,
	moving: false
};

class Movable extends React.Component {

	constructor(props) {

		super(props);

		// setup the component's initial state 
		this.state = initial_state;

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
```

`EventListener` will add and remove the `mousemove` and `mouseup` callbacks to `document` as the component is mounted and unmounted.