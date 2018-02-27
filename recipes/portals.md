# Rendering things outside the component

A component can generally be thought of as a single box in your app, or in more technical terms, it creates a single subtree in the DOM, with all the elements nested inside the component's root element.

But, similarly to [handling events outside the component](./outside-events.md), our component may need to break out of its box to render some things; tooltips, modals, and other such elements must be "teleported" to another place — usually `document.body` — for them to work as intended.

React 16 introduces a concept called [`Portals`](https://reactjs.org/docs/portals.html) with which a component can put some of its UI in a DOM node that's outside the component.

So instead of rendering a `Modal` component inline:

```jsx
import React from 'react';

class MyComponent extends React.Component {
	render() {
		return (
			<div>
				<Modal/>
			</div>
		);
	}
}
```

...you can place it in `document.body`, where it can stretch its wings:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
	render() {
		return (
			<div>
			{
				ReactDOM.createPortal(
					<Modal/>,
					document.body
				)
			}
			</div>
		);
	}
}
```

## A few things to keep in mind

### Event bubbling

### Root elements for portals

