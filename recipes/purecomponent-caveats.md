# `React.PureComponent` caveats

When used appropriately, pure components can boost your application's performance by avoiding unnecessary re-renders. It performs a _shallow comparison_ of props and state against their previous values and skips the re-render if nothing (shallowly) changed.

This comparison is reasonably fast (in any case, faster than re-rendering), but be mindful of some situations where you get the worst of both worlds: you perform the comparison, but the component always re-renders anyways. Don't let this happen to you.

__Are you sending functions (callbacks)__ to your component? Make sure you're not always sending a new function, as with `bind`-ing functions in-place (see [The `property` pattern for callbacks](./property-pattern.md)).

__Are you sending children__ to your component? Remember that `children` is still a prop. Unless you're sending a string as the only child for the component, this property _will always change_. Drop `React.PureComponent` in this case.

__Are you sending React components__ on any props? These props will always change, so you're better off dropping `React.PureComponent`.