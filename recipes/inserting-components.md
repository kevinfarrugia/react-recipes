# Embedding React components in an existing app

Your app may be built using plain JavaScript, or some library or framework, and you want to have some portions of it in React; or maybe you're slowly refactoring your app to use React, but you can't rewrite it all at once. In such cases, it's useful to know how to embed React components within a larger app.

In practice, it boils down to:

* getting the component in and out of the DOM; 
* updating the component with outside data;
* acting upon events that originate from the component. 

Turns out it's refreshingly easy to do it.

## Mounting the component

Any React component will need a DOM element to claim as its own, where it can roam free:

```html
<div id='my-component-wrapper'><!-- My React Component goes here --></div>
```

The [`ReactDOM.render`](https://reactjs.org/docs/react-dom.html#render) method to get our component in the DOM:

```jsx
import ReactDOM from 'react-dom';

// get a reference to the DOM element in which to mount our React Component
let component_wrapper = document.getElementById("my-component-wrapper");

// and then render the component in it
ReactDOM.render(<MyComponent/>, component_wrapper);
```

## Unmounting the component

To remove the component from the DOM, we need to know the element in which we rendered the component, and call [`ReactDOM.unmountComponentAtNode`](https://reactjs.org/docs/react-dom.html#unmountcomponentatnode):

```jsx
import ReactDOM from 'react-dom';

// get a reference to the DOM element in which we mounted our React component
let component_wrapper = document.getElementById("my-component-wrapper");

// and then unmount the component from it
ReactDOM.unmountComponentAtNode(component_wrapper);
```

## Updating the component

Our React component receives data from the outside via its `props`. Whenever we need to update the component with new props — and this is the part that feels magic in its simplicity — we just render it again using the new props:

```jsx
import ReactDOM from 'react-dom';

// get a reference to the DOM element in which our React component is mounted
let component_wrapper = document.getElementById("my-component-wrapper");

// and then re-render the component with the new props
ReactDOM.render(<MyComponent data={updated_data}/>, component_wrapper);
```

## Listening to events from the component

Finally, our component may trigger actions as a response to user interaction which we need to interpret outside the component, via callbacks:

```jsx
function doSomething() {
	// component triggered the action,
	// let's do something about it
}

ReactDOM.render(
	<MyComponent data={updated_data} onAction={doSomething}/>, 
	component_wrapper
);
```

## Further reading

Look at the React guide for using it [with other libraries](https://reactjs.org/docs/integrating-with-other-libraries.html#integrating-with-other-view-libraries) for more examples.