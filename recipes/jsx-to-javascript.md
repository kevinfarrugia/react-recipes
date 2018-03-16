# Reading JSX as it were JavaScript

## A simple DOM element

A DOM element defined in JSX: 

```jsx
<div className='app'></div>
```

is transpiled to JavaScript:

```js
React.createElement(
	// type
	'div', 

	// props
	{
		className: 'app'
	}
)
```

which results in a plain object:

```js
{
	// this is the representation of our element
	"type": "div", 
	"props": { 
		"className": "app" 
	},

	// identifies the object as a React element
	"$$typeof": Symbol(react.element),

	// and some other properties React needs
	"key": null, 
	"ref": null,
	"_owner": null, 
	"_store": {}
}
```

## A DOM element with children

### Single child

```jsx
<div className='app'>
	Hello world
</div>
```

```js
React.createElement(
	// type
	'ul',

	// props
	{
		className: 'app'
	},

	'Hello World'
)
```

```js
{ 
	"type": "div", 
	"props": {
		"className": "app", 
		"children": "Hello world" 
	},
	// ...
}
```

### Many children

```jsx
<ul className='bullets'>
	<li>One</li>
	<li>Two</li>
</ul>
```

```js
React.createElement(

	// type
	'ul',

	// props
	{
		className: 'bullets'
	},

	// children
	React.createElement(
		'li',
		{},
		'One'
	),
	React.createElement(
		'li',
		{},
		'Two'
	)
)
```

```js
{
  "type": "ul",
  "props": {
    "className": "bullets",
    "children": [
      {
        "type": "li",
        "props": {
          "children": "One"
        },
        // ...
      },
      {
        "type": "li",
        "props": {
          "children": "Two"
        }
        // ...
      }
    ]
  },
  // ...
}
```
