# The `property` pattern for callbacks

When you need to react to actions from each child component, you'll quickly find yourself in a bind (te-hee). Technically, you'll need to pass a separate callback function to each child, to tell which child is the source of the event.

[The recommendation from the React docs](https://reactjs.org/docs/handling-events.html) is to `bind` the callback function to each child:

```jsx
render() {
	let { items } = this.props;
	return (
		<ul>
			{ 
				items.map(item => 
					<li 
						key={item.id}
						onClick={this.removeItem.bind(this, item.id)}
					>
						{item.label}
					</li>
				)
			}
		</ul>
	);
}

removeItem(id) {
	// remove item with the passed id
}
```

This solution comes with the drawback that each time you render the component, the children always get _different functions_ as their `onClick` callback, causing unnecessary DOM operations.

In case of simple DOM elements, we don't have too many alternatives to this. But for custom components, don't be tempted to use callbacks this way. Instead, I like to use the `property` pattern:

> Make your components accept an optional `property` prop that gets sent along with all callbacks originating from the component.

With this pattern we can simply write:

```jsx
render() {
	let { items } = this.props;
	return (
		<List>
			{ 
				items.map(item => 
					<Item 
						key={item.id}
						property={item.id}
						onClick={this.removeItem}
					>
						{item.label}
					</Item>
				)
			}
		</List>
	);
}

removeItem(id) {
	// remove item with the passed id
}
```

Our `Item` component will gladly accept a `property` prop to pass along to callbacks:

```jsx
class Item extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick(this.props.property);
	}

	render() {
		return (
			<li onClick={this.onClick}>{this.props.children}</li>
		);
	}
}
```

When you apply this pattern across several components, it makes it easy to bind each of them to different parts of the state:

```jsx
	render() {
		return (
			<div className='editor'>

				<Slider 
					value={this.state.slidervalue} 
					property={slidervalue}
					onChange={this.update}
				/>

				<List
					value={this.state.listvalue}
					property={listvalue}
					onChange={this.update}
				/>

				{ // ... etc ... }
			</div>
		)
	}

	update(value, prop) {
		this.setState({
			[prop]: value
		});
	}
```