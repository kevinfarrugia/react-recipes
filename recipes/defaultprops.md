# Ways to use `defaultProps`

[`defaultProps`](https://reactjs.org/docs/react-component.html#defaultprops) is an object you set on your component to provide default values for your properties. If your component gets initialized without a property (meaning its value is `undefined`), you'll get its default value instead. Note that `null` is a valid value that will not fall back to the default.

The main purpose of `defaultProps` is to plug any “holes” in your properties. 

One thing I like to do is provide empty functions to any callbacks my component accepts, so that when I invoke them I don't need to check whether they've been passed:

```js
class Slider extends React.Component {
	onChange() {
		// no need to check that this.props.onChange exists
		this.props.onChange(this.state.value);
	}
}

Slider.defaultProps = {
	onChange: value => {}
}

```

`defaultProps` is also a good way to document the properties your component accepts:

```js
Slider.defaultProps = {
	// A number that defines the minimum value for the slider
	min: 0,
	
	// A number that defines the maximum value for the slider
	max: 100,

	// A callback that gets invoked each time the slider's value changes
	onChange: value => {}
};
```

You may even go further and document _optional_ properties, whose default value is `undefined`:

```jsx
class Slider extends React.Component {
	onChange() {
		this.props.onChange(this.state.value, this.props.property);
	}
}

Slider.defaultProps = {
	// When defined, the property will be sent along with the value
	// on the `onChange` callback
	property: undefined 
};
```