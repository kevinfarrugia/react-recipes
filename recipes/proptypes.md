# Ways to use `propTypes`

You can use the [`propTypes`][react-proptypes] property on your component to typecheck the props with which it gets instantiated. Used along with [`defaultProps`](./defaultprops.md), it allows you to enforce and document the types of props your component accepts. 

Various type definitions are available in the [`prop-types`](https://npmjs.com/package/prop-types) package, which you'll need to install separately:

```bash
yarn add prop-types
```

And then, for any component, you can do:
```js
import React from 'react';
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
	render() {
		return `I love the number ${this.props.count}`;
	}
}

MyComponent.propTypes = {
	count: PropTypes.number
};
```

The [React docs][react-proptypes] contain a list of available types.

#### Performance

Typechecking is only enabled in the _development_ build of React, so it does not incur any performance penalty in your production-ready application. 

The only real impact is that, while they're not evaluated, a lot of propTypes definitions may add a few kilobytes to your bundle. If you want to save that extra bandwidth, there's a [Babel plugin][remove-proptypes] that strips the propTypes at build-time.

[react-proptypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[remove-proptypes]: https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types