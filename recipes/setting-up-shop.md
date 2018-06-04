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

### Add scripts to `package.json`

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

__Create your React App__

__Add build folder to .gitignore__

__TODO publish to github pages__

