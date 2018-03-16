# Embedding React components in an existing app

Your app may be built using plain JavaScript, or some library or framework, and you want to have some portions of it in React; or maybe you're slowly refactoring your app to use React, but you can't rewrite it all at once. In such cases, there's no reason you can't embed little bits of React throughout the app and slowly work your way up to bigger and bigger chunks.

In practice, it boils down to:

* getting the component in and out of the DOM; 
* updating the component with outside data;
* listening to events your component triggers. 

And as it turns out, it's refreshingly easy to do it!

## How to add a React component to your app

### Mounting the component

Any React component will need a DOM element to claim as its own, where it can do its thing:

```html
<div id='my-button-wrapper'><!-- My React Button goes here --></div>
```

The [`ReactDOM.render`](https://reactjs.org/docs/react-dom.html#render) method will then get our component in the DOM:

```jsx
import ReactDOM from 'react-dom';

const MyButton = props => <button>{props.label}</button>;

// get a reference to the DOM element in which to mount our React Component
let wrapper = document.getElementById("my-button-wrapper");

// and then render the component in it
ReactDOM.render(<MyButton label="Push me"/>, wrapper);
```

### Unmounting the component

To remove the component from the DOM, we need to know the element in which we rendered the component, and call [`ReactDOM.unmountComponentAtNode`](https://reactjs.org/docs/react-dom.html#unmountcomponentatnode):

```jsx
import ReactDOM from 'react-dom';

// get a reference to the DOM element in which we mounted our React Component
let wrapper = document.getElementById("my-button-wrapper");

// and then unmount the component from it
ReactDOM.unmountComponentAtNode(wrapper);
```

### Updating the component

The way our React component receives data from the outside world is via its `props`. Whenever we need to update the component with new data — and this is the part that feels magic in its simplicity — we just render it again using the new props, and React knows how to do it efficiently:

```jsx
import ReactDOM from 'react-dom';

// get a reference to the DOM element in which our React component is mounted
let wrapper = document.getElementById("my-button-wrapper");

// and then re-render the component with the new props
ReactDOM.render(<MyButton label={new_label}/>, wrapper);
```

### Listening to events from the component

Finally, our component may trigger actions as a response to user interaction. To listen to them, we send the outside functions as callbacks via `props`:

```jsx
function shout() {
	alert('Aaaah!');
}

ReactDOM.render(<MyComponent label="Press me" onPress={shout}/>, wrapper);
```

## How to handle many React components in your app

With the approach above, you can have as many separate React components in your app as you wish. 

A cleaner alternative is to keep a single React component that you manage outside React (our _root_ component), which then spreads its children across various DOM elements on the page with React's [Portals](./portals.md) feature.

Instead of separately managing a `Header` component that goes to the `#header` DOM element, and a `Footer` component that goes to the `#footer` DOM element, let's have a single `App` component (mounted in an `#app` DOM element) that manages both:

```jsx
class App extends React.Component {

	constructor(props) {
		super(props);

		// cache the DOM nodes where we'll
		// place our components via Portals
		this.header_el = document.getElementById('#header');
		this.footer_el = document.getElementById('#footer');
	}

	render() {
		<div>
			{ React.createPortal(<Header/>, header_el) }
			{ React.createPortal(<Footer/>, footer_el) }
		</div>
	}
}
```

## Further reading

This is all there really is to embedding React components in an outside app. You can take a look at the React guide for using it [with other libraries](https://reactjs.org/docs/integrating-with-other-libraries.html#integrating-with-other-view-libraries) for more examples.