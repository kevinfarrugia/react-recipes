# Glossary

__pure component__ — a component that, for a set of props it receives, generates the same output every time. This is used when talking about components that extend `React.PureComponent`, which is an optimized `React.Component` that only re-renders when the props actually change.

__stateless component__ — a React component that does not keep any internal state: you don't use `setState` nor read off `this.state`.