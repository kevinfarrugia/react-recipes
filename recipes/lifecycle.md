# The Component lifecycle

__Note:__ Methods marked with ⚠️ will be deprecated starting with React 16.3, and methods marked with 🆕 can be used as their replacement.

The life of a component has three phases:

* __Mounting__ is when the component gets added to the DOM;
* __Updating__ is the component re-rendering in response to changes in its props or state;
* __Unmounting__ is when the component is removed from the DOM.

React implements a handful of so-called _lifecycle methods_ that allow you to observe and control how the component behaves in each of these phases. 

## The Mounting phase

When a component is added to the DOM, the following methods are called in succession:

* [`constructor`](https://reactjs.org/docs/react-component.html#constructor)
* 🆕 `static getDerivedStateFromProps`
* ⚠️ `componentWillMount`
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentdidmount)

## The Unmounting phase

A single method is called before the component is removed from the DOM:

* [`componentWillUnmount`](https://reactjs.org/docs/react-component.html#componentwillunmount)

There is no `componentDidUnmount` equivalent yet, although [there seems to be some utility to it](https://github.com/facebook/react/issues/6424).

## The Updating phase

The mounted component will re-render when its state is changed or when it receives new props from a parent component. 

### The state changes

As the result of calling `setState` on a component, the following methods are invoked in succession:

* [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)
* ⚠️ `componentWillUpdate`
* 🆕 `static getSnapshotBeforeUpdate`
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentdidupdate)

This succession is invoked with any `setState` call, regardless of whether the state has actually changed or not. It's the responsibility of the `shouldComponentUpdate` method to dictate whether a re-render is warranted.

### The props change

When the component receives its props from a parent component, ~~the `componentWillReceiveProps` method is invoked~~ `getDerivedStateFromProps` allows you to map any prop to the state, followed by the same succession of methods that a change in state would incur:

* 🆕 `static getDerivedStateFromProps`
* ⚠️ `componentWillReceiveProps`
* [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)
* ⚠️ `componentWillUpdate`
* 🆕 `static getSnapshotBeforeUpdate`
* [`render`](https://reactjs.org/docs/react-component.html#render)
* [`componentDidUpdate`](https://reactjs.org/docs/react-component.html#componentdidupdate)

This succession happens any time a mounted component receives props, regardless of whether they have changed or not — so each time a parent re-renders, the component will go through these methods and also re-render, unless the `shouldComponentUpdate` method dictates otherwise.

## Error handling

* [`componentDidCatch`](https://reactjs.org/docs/react-component.html#componentdidcatch) is emitted whenever there was an error in any of the _child components_, and it's the method used for building [Error Boundaries](./error-boundaries.md) in your app.

## New static methods in React 16.3

* `getDerivedStateFromProps`
* `getSnapshotBeforeUpdate`
