# react-recipes

React Recipes & Patterns. This project is [AWL](https://github.com/danburzo/as-we-learn).

## `setState()`

There are sev styles of `setState()` you need to be aware of:

Depends on previous state ? | No | Yes
--------------------------- | --- | --
No notification of change | `setState(object)` | `setState(function)`
Notified of _each_ change | `setState(object, callback)` | `setState(function, callback)`
Notified of _batched_ changes | use `componentDidUpdate` | use `componentDidUpdate`

