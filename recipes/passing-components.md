# Passing React components via props

Two things right off the bat:

* You can pass React components on any prop, not just `children`, and conversely;
* You can pass anything to `children`, not just React components.

So when modeling the communication between components, you can:

__Create slots to be filled in your component__

```jsx
class Reader extends React.Component {
	render(
		<div className='reader'>
			<div className='sidebar'> { this.props.sidebar } </div>
			<div className='content'> { this.props.content } </div>
		</div>
	) 
}

<Reader
	sidebar={<Sidebar/>}
	content={<Content/>}
/>
```

__Use `children` as the single slot to be filled__

```jsx
class Modal extends React.Component {
	render(
		<div className='modal'>
			<div className='modal__content'>
				{ this.props.children }
			</div>
		</div>
	)
}
```