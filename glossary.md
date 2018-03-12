# Glossary

The glossary explains some common React jargon in simpler terms.

#### ancestor component

See [component, ancestor](#component-ancestor).

#### Babel

#### callback function

See [function, callback](#function-callback).

#### child component

See [component, child](#component-child).

#### class component

See [component, class](#component-class).

#### descendant component

See [component, descendant](#component-descendant).

#### comparison, deep

#### comparison, shallow

#### component

#### component, ancestor

We say that a component is an _ancestor_ of another component if it's higher up the [component tree](#component-tree). A direct ancestor is usually called a [parent](#component-parent) component. 

The reverse of an ancestor is called a [descendant](#component-descendant). A direct descendant is called a [child](#component-child).

```jsx
<A>
	<B>
		<C/>
	</B>
</A>
```

In the example above, `A` is an ancestor of `C`; conversely, `C` is a descendant of `A`.

In React parents and children communicate via [props](#prop). Ancestors and descendants can use the [context](#context) API to communicate direcly without having to pass props down the component tree from parent to child.

#### component, child

In React parents and children communicate via [props](#prop).

#### component, class

#### component, descendant

We say that a component is a _descendant_ of another component if it's lower down the [component tree](#component-tree). A direct descendant is usually called a [child](#component-child) component. 

The reverse of an descendant is called an [ancestor](#component-ancestor). A direct ancestor is called a [parent](#component-parent).

```jsx
<A>
	<B>
		<C/>
	</B>
</A>
```

In the example above, `C` is an descendant of `A`; conversely, `A` is an ancestor of `C`.

In React parents and children communicate via [props](#prop). Ancestors and descendants can use the [context](#context) API to communicate direcly without having to pass props down the component tree from parent to child.

#### component, functional

#### component, higher-order

#### component, parent

In React parents and children communicate via [props](#prop).

#### component, pure

#### component, stateful

#### component, stateless

#### component tree

Also called _component hierarchy_.

#### context

#### cross-cutting concern

#### deep comparison

See [comparison, deep](#comparison-deep).

#### deep merge

See [merge, deep](#merge-deep).

#### element

#### ES2015

#### ES6

#### event

#### event, native

#### event, synthetic

#### function, callback

#### function, pure

#### function, impure

#### functional component

See [component, functional](#component-functional).

#### higher-order component

See [component, higher-order](#component-higher-order).

#### immutable structure

#### impure function

See [function, impure](#function-impure).

#### JSX

#### lifecycle method

See [method, lifecycle](#method-lifecycle).

#### map

#### merge, shallow

#### merge, deep

#### method, lifecycle

#### mount

_Mounting_ means adding a [component](#component) to the DOM. The opposite operation of removing a component from the DOM is called [unmounting](#unmount).

#### native event

See [event, native](#event-native).

#### parent component

See [component, parent](#component-parent).

#### pure component

See [component, pure](#component-pure).

#### pure function

See [function, pure](#function-pure).

#### prop

#### property, static

#### React

#### Redux

#### ref

#### shallow comparison

See [comparison, shallow](#comparison-shallow).

#### shallow merge

See [merge, shallow](#merge-shallow).

#### side-effect

#### state

#### state (React)

#### state (Redux)

#### stateful component

See [component, stateful](#component-stateful).

#### stateless component

See [component, stateless](#component-stateless).

#### static property

See [property, static](#property-static).

#### synthetic event

See [event, synthetic](#event-synthetic).

#### unmount

_Unmounting_ means removing a [component](#component) to the DOM. The opposite operation of adding a component to the DOM is called [mounting](#mount).

#### Webpack

