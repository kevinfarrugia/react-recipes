# Event handling outside the component

Sometimes, a component needs to listen to events on DOM nodes outside its scope, most frequently on either `document` or `window`. Instead of manually managing the events via `addEventListener` and `removeEventListener`, you can use the small [`react-event-listener`](https://github.com/oliviertassinari/react-event-listener) library to add them "the React way", which is much more succint and less error-prone. 

For an example implementation, look at this simple component that you can move with your mouse:

```jsx
import EventListener from `react-event-listener`;

const initial_state = {
	x: 0,
	y: 0,
	moving: false
};

component Movable extends React.Component {

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
			position: absolute,
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