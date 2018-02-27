# Glossary

__component, functional__ — a _functional component_ is a way to define a component as a simple function that takes props as input and returns a corresponding UI.

__component, pure__ — a component that, for a set of props it receives, generates the same output every time. This is used when talking about components that extend `React.PureComponent`, which is an optimized `React.Component` that only re-renders when the props actually change.

__component, stateless__ — a React component that does not keep any internal state: you don't use `setState` nor read off `this.state`.