# Setting up shop: Start a React project from scratch

Before we can actually start writing React code, we need to set a few things up. Since we'll be relying on JSX syntax and more recent additions to JavaScript (such as modules and classes), we can't just include our code and libraries in `<script>` tags and start working. We need to transform our code before it works in browsers.

In particular, any React project needs:

__A tool to _transpile_ your code__. A transpiler transforms your code from JSX / fancy JavaScript to normal JavaScript that works in browsers; [Babel](https://babeljs.io) and [Bublé](https://buble.surge.sh/guide/) are some popular choices.

__A tool to _bundle_ your JavaScript modules__, and any code you import from npm modules, into a single JavaScript file. They usually have a way to communicate with the _transpiler_ so that your JavaScript is transformed to browser-compatible code. They will also handle other types of files, such as HTML, CSS, JSON, or SVG, so you can import them in your project as you would normal JS modules. [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), [Rollup](https://rollupjs.org/), and [Parcel](https://parceljs.org/) are examples of bundlers.

While Webpack is the more established bundler, setting it up is tedious and error-prone. Parcel, on the other hand, is a bundler that needs no configuration and works out-of-the-box for most things.

I don't want to spend my life configuring build tools, and that probably makes the two of us; we'll therefore use Parcel.

__Note:__ I've written down what I did on a macOS setup, but it can be tweaked to any operating system with a bit of work.

## Prerequisites

Like many other JavaScript projects, React is distributed as [NPM packages](https://docs.npmjs.com/getting-started/what-is-npm); You add it to your project with the command line.

To start a React project we need:

* A command-line such as the Terminal in macOS
* Node.js and NPM (if you installed Node, it comes with the `npm` command-line tool)
* Yarn (Optionally)

__Note:__ The instructions below include commands run with Yarn, which is an alternative to the `npm` command-line tool that's a bit nicer to work with in my opinion. [The Yarn documentation](https://yarnpkg.com/lang/en/docs/migrating-from-npm/#toc-cli-commands-comparison) shows the `npm` equivalents to the various `yarn` commands, if you plan on using it instead.

## Setting up

### Create, and then initialize, your project

Make the `my-project` folder and navigate to it using these commands:

```bash
mdkir my-project
cd my-project
```

Before we can install React, we need a `package.json` file that lists all the dependencies in our project. We create it with:

```bash
yarn init --yes
```

__Note__: The `--yes` flag instructs Yarn to skip all the questions and just initialize a run-of-the-mill `package.json` that looks like this:

```js
{
  "name": "my-project",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

### Install React and ReactDOM

We install the `react` and `react-dom` packages as dependencies to our project:

```bash
yarn add react react-dom
```

### Install the Parcel bundler

We install the Parcel bundler as a _development_ depenency to our project — our app only depends on Parcel while we're building it. 

```bash
yarn add --dev parcel-bundler
```

### Create a project structure

While you can set up your project's structure in many ways, let's keep it simple and just add a few folders:

```
my-project
  dist/
  public/
  src/
```

* __src__ will hold the JS source code
* __public__ holds the static files (HTML, CSS, SVG, images, etc.)
* __dist__ is where our app will get built

Let's make an _index.js_ file inside our `src` folder:


__src/index.js__

```js
console.log('Hello world');
```

Let's make an _index.html_ file inside the `public` folder, and fetch our `index.js` script inside it:

__public/index.html__

```html
<!DOCTYPE html>
  <html>
    <head>
      <meta charset='utf-8'/>
      <title>My project</title>
    </head>
    <body>
      <div id='app'>
        <!-- Our React App goes here -->
      </div>

      <script src='../src/index.js'></script>
    </body>
</html>
```

If you open `index.html` in a browser and open the Developer Tools, you should see the `Hello World` message. This means we've properly linked the script inside the HTML file. 

Let's now configure Parcel to process our files so we can start writing some modules. 

### Add scripts to `package.json`

In `package.json` we add two scripts:

* _start_ will make Parcel watch for changes in our source files and continously build our bundle
* _build_ will build an optimized version of our code that we can then deploy to a server.

```js
{
  ...
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
  ...
}
```

You run these scripts via `yarn` like so:

```bash
yarn start

# You should see something like this in your console:
# ---------------------------------------------------
# yarn run v1.7.0
# $ parcel public/index.html
# Server running at http://localhost:1234 
# ✨  Built in 3.23s.
```

Opening [http://localhost:1234](http://localhost:1234) in your browser lets you access your app. When you make changes to your source files, the app automatically reloads with the changes.

```bash
yarn build

# You should see something like this in your console:
# ---------------------------------------------------
# yarn run v1.7.0
# $ parcel build public/index.html
# ✨  Built in 2.76s.
# dist/src.5e4eefaf.js     102.63 KB    8.12s
# dist/index.html              197 B      9ms
# dist/src.c0271552.css         43 B     12ms
# dist/src.3e396d5e.map          0 B    8.12s
# ✨  Done in 3.33s.
```

This builds your whole app in the `dist/` folder, the content of which you can then take and put up on a server.

Now that we've set up Parcel, we can finally start writing Fancy JavaScript™. 

### Create your React App

Under `src/`, we create a `components/` folder and write a simple _Hello world_ React component:

__src/components/App.js__

```jsx
import React from 'react';

class App extends React.Component {
  render() {
    return "Hello world!";
  }
}

export default App;
```

And then, in our _index.js_ file, we import the module containing our React component and [add it to our page](./inserting-components.md).

__src/index.js__

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

ReactDOM.render(<App/>, document.getElementById('app'));
```

If we head back to the browser, the app should now display the message _Hello world!_ on-screen, which means we've successfully set up a React project. 🙌

### A dash of CSS

To demonstrate how to load other types of files, such as CSS, let's make a minimal stylesheet for our app:

__src/style.css__

```css
body {
  font-family: sans-serif;
}
```

In our main JS file, _index.js_, we import the CSS much like we would a normal JS module:

__src/index.js__

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

// importing CSS files in your app will create a CSS bundle
// that gets automatically included in your index.html file.
import './style.css';

import App from './components/App';

ReactDOM.render(<App/>, document.getElementById('app'));
```

The browser should now show us the same _Hello World!_ message, but now with a different font.

That, my friend, is a wrap! 🙌

## Alternatives

I hope you found this article, at the end of which we have pretty much all we need to start playing with React, not to long or hard to follow. There are other ways to get a similar result:

* Use the [`create-react-app`](https://github.com/facebook/create-react-app) command-line tool to set up a React environment even faster; it's frankly a great experience, with the caveat that it comes with a bunch of extras that make it harder to discern what's going on when you're first starting out.
* Take the scenic route and walk through this [excellent article](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) on setting up React with Babel and Webpack, if you prefer to expose yourself to some of the unsightly configuration that Parcel handles for you.

## A couple of notes on Git / GitHub

Not to stretch this article further, but a few quick notes if you put your project on GitHub.

First off, you should create a `.gitignore` file in your root folder to which you add the following lines:

```
node_modules/
dist/
```

This instructs Git not to include the two folders in its version control. We don't want these hanging around on Github.

And if you're curious on how to publish the content of the `dist/` folder to GitHub Pages, check out the [`gh-pages`](https://npmjs.org/package/gh-pages) package.