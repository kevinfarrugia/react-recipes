# Passing props to `this.props.children`

You want your component to augment all its children with some properties. To do so you can use `React.Children.map` and `React.cloneElement`, like so:

```jsx

render() {
	<div>
		{
			React.Children.map(
				this.props.children,
				child => 
					React.cloneElement(child, {
						value: '5'
					})
			)
		}
	</div>
}
```

When a child gets passed to our component, its `value` prop will be overwritten with `5`.

What if instead we want the component to provide fallbacks if some properties are missing from the child? We can do so with a small tweak to our mapping function:

```js
child => React.cloneElement(child, {
	value: '5',
	...child.props
})
```

...in which we put back any of the child props we might have overwritten.