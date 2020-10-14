# Setting up shop: Start a React project from scratch

Before we can actually start writing React code, we need to set a few things up. We can't just include our code and libraries in `<script>` tags and call it a day<a href='#fn1'><sup>1</sup></a>, since we'll be relying on JSX syntax and more recent additions to JavaScript (such as modules and classes).

We need to transform our code before it works in browsers. In particular, a React project needs:

__A tool to _transpile_ your code__. A transpiler transforms your code from JSX / fancy JavaScript to normal JavaScript that works in browsers; [Babel](https://babeljs.io) and [Bublé](https://buble.surge.sh/guide/) are some popular choices.

__A tool to _bundle_ your JavaScript modules__, and any code you import from npm modules, into a single JavaScript file. The bundler usually has a way to communicate with the _transpiler_ so that your JavaScript is transformed to browser-compatible code in the process. It will also handle other types of files, such as HTML, CSS, JSON, or SVG, so you can import them in your project as you would normal JS modules. [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/), and [Parcel](https://parceljs.org/) are examples of bundlers.

Parcel, a bundler that works for most things we need without requiring any configuration, is a good choice for quickly setting up a React playground.

__Note:__ I'm on macOS, but the steps should be similar enough on other operating systems.

## Setting up

### Prerequisites

Like many other JavaScript libraries, React is distributed through [npm packages](https://docs.npmjs.com/getting-started/what-is-npm); You add it to your project with the command line.

To start a React project we need:

* A command-line such as the Terminal in macOS
* [Node.js](https://nodejs.org/en/) and npm (if you installed Node, it comes with the `npm` command-line tool)

### Create, and then initialize, your project

Make the `my-project` folder and navigate to it using these commands:

```bash
mdkir my-project
cd my-project
```

Before we can install React, we need a `package.json` file that lists all the dependencies in our project. We create it with:

```bash
npm init --yes
```

The `--yes` flag instructs npm to skip all the questions and just initialize a run-of-the-mill `package.json` that looks like this:

```json

  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Install React and ReactDOM

We install the `react` and `react-dom` packages as dependencies to our project:

```bash
npm install react react-dom
```

### Install the Parcel bundler

We install the Parcel bundler as a _development_ depenency to our project — our app only depends on Parcel while we're building it<a href='#fn2'><sup>2</sup></a>. 

```bash
npm install --save-dev parcel-bundler
```

### Create a project structure

While you can set up your project's structure in many ways, let's keep it simple and just add a couple of folders:

```
my-project
  dist/
  src/
```

__src/__ will hold our application's source code: HTML, JavaScript, CSS, SVG, images and all we want to include. The __dist/__ folder is where our app will get built, so we can deploy it to a server.

To make these folders, we can run:

```bash
mkdir src dist
```

Let's make an _index.js_ file inside our `src` folder:


__src/index.js__

```js
console.log('Hello world');
```

And a _index.html_ file as well, where we fetch our `index.js` script:

__src/index.html__

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

      <script src='./index.js'></script>
    </body>
</html>
```

If you open `index.html` in a browser and open the Developer Tools, you should see the `Hello World` message in the console. This means we've properly linked the script inside the HTML file. 

Let's now configure Parcel to process our files so we can start writing some modules. 

### Add scripts to `package.json`

In `package.json` we add two scripts:

* _start_ will make Parcel watch for changes in our source files and continously build our bundle
* _build_ will build an optimized version of our code that we can then deploy to a server.

__package.json__

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  },
  "devDependencies": {
    "parcel-bundler": "^1.12.4"
  }
}
```

Let's run the scripts! To start the development server:

```bash
npm run-script start
```

The command outputs:

```bash
> my-project@1.0.0 start /Users/danburzo/projects/my-project
> parcel src/index.html

Server running at http://localhost:1234 
✨  Built in 1.20s.
```

Opening [http://localhost:1234](http://localhost:1234) in your browser lets you access your app. When you make changes to your source files, the app automatically reloads with the changes. To close the server, press <kbd>Ctrl + C</kbd> in the Terminal window.

To build an optimized bundle suitable for putting it in front of users:

```bash
npm run-script build
```

The command outputs:

```bash
> my-project@1.0.0 build /Users/danburzo/projects/my-project
> parcel build src/index.html

✨  Built in 1.80s.

dist/src.67e05423.js        1.13 KB    110ms
dist/src.67e05423.js.map      189 B      3ms
dist/index.html               166 B    1.63s
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

And that, friends, is a wrap! 🙌

## Alternatives

I hope you found this article, at the end of which we have pretty much all we need to start playing with React, not too long, nor hard to follow. There are other ways to get a similar result:

* Use the [`create-react-app`](https://github.com/facebook/create-react-app) command-line tool to set up a React environment even faster; it's frankly a great experience, with the caveat that it comes with a bunch of extras that make it harder to discern what's going on when you're first starting out. 
* Take the scenic route and walk through this [excellent article](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) on setting up React with Babel and Webpack, if you prefer to expose yourself to some of the unsightly configuration that Parcel sweeps under the rug for you.

## A couple of notes on Git / GitHub

Not to stretch this article further, but a few quick notes if you put your project on GitHub.

First off, you should create a `.gitignore` file in your root folder to which you add the following lines:

```
node_modules/
dist/
```

This instructs Git not to include the two folders in version control. We don't want these hanging around on Github.

And if you're curious on how to publish the content of the `dist/` folder to GitHub Pages, check out the [`gh-pages`](https://npmjs.org/package/gh-pages) package.

---

<sup id='fn1'>1</sup> [Technically you can](https://reactjs.org/docs/getting-started.html#online-playgrounds), for small experiments on your machine. You'll probably want to avoid publishing them as-is on the web, though.

<sup id='fn2'>2</sup> When bundling JavaScript packages, all dependencies are technically _development dependencies_, because they're only ever needed as you build the project. However, it's useful to make a distinction between things that end up in the bundle and those who don't.