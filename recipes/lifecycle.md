# The Component lifecycle

The life of a component has three phases:

* __Mounting__ is when the component gets added to the DOM;
* __Updating__ is the component reacting to changes in its props or state;
* __Unmounting__ is when the component is removed from the DOM.

React implements a handful of so-called _lifecycle methods_ that allow you to observe and control how the component behaves in each of these phases.

## The mounting phase

When a component is added to the DOM, the following methods are called in succession:

* [`constructor`](https://reactjs.org/docs/react-component.html#constructor)
* [`componentWillMount`](https://reactjs.org/docs/react-component.html#componentWillMount)
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentDidMount)

## The unmounting phase

A single method is called before the component is removed from the DOM:

* [`componentWillUnmount`](https://reactjs.org/docs/react-component.html#componentWillUnmount)

## The updating phase

The __mounted__ component will re-render when its state is changed or when it receives new props from a parent component. 

### The state changes

As the result of calling `setState` on a component, the following methods are invoked in succession:

* [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldComponentUpdate)
* [`componentWillUpdate`](https://reactjs.org/docs/react-component.html#componentWillUpdate)
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentDidUpdate)

This succession happens with any `setState` call, regardless of whether the state has actually changed or not. It's the responsibility of the `shouldComponentUpdate` method to dictate whether such a "change" warrants a re-render.

### The props change

When the component receives its props from a parent component, the `componentWillReceiveProps` method is invoked, followed by the same succession of methods that a change in state would incur:

* [`componentWillReceiveProps`](https://reactjs.org/docs/react-component.html#componentWillReceiveProps)
* [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldComponentUpdate)
* [`componentWillUpdate`](https://reactjs.org/docs/react-component.html#componentWillUpdate)
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentDidUpdate)

This succession happens any time a mounted component receives props, regardless of whether they have changed or not — so each time a parent re-renders, the component will go through these methods and also re-render, unless the `shouldComponentUpdate` method dictates otherwise.

