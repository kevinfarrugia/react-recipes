# Setting up shop: Start a React project from scratch

Before we can actually start writing React code, we need to set a few things up. Things like the JSX syntax and more recent additions to JavaScript (such as modules and classes) need to be processed before they work in a browser.

In particular, any React project needs:

* a tool to _transpile_ your code — that is, transforms your code from JSX / Fancy JavaScript to normal JavaScript;
* a tool to _bundle_ your JavaScript modules — and other files such as HTML, CSS, SVG, etc — into a single JavaScript, or maybe a handful.

For each of these tasks, there are a few alternatives:

* Babel and Bublé for transpiling
* Webpack, Browserify, Rollup, and Parcel for bundling.

The easiest to set up is Parcel, because it runs Babel under the hood and you don't need to configure anything — it just works out of the box for most things.

I've written down what I did on a macOS setup, but it can be tweaked to any operating system with a bit of work.

## Prerequisites

Like many other JavaScript projects, React is distributed as [NPM packages](https://docs.npmjs.com/getting-started/what-is-npm) and is added to your project with the command line.

To start a React project we need:

* A command-line such as macOS' Terminal
* Node and NPM
* Yarn (Optionally)

__Note:__ The instructions below include commands run with Yarn, which is an alternative to the `npm` command-line tool that's a bit nicer to work with in my opinion. [The Yarn documentation](https://yarnpkg.com/lang/en/docs/migrating-from-npm/#toc-cli-commands-comparison) shows the `npm` equivalents to the various `yarn` commands, if you plan on using it instead.

## Setting up

### Create, and initialize, your project

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



```
{
	"scripts": {
		"start": "parcel index.html",
		"build": "parcel build index.html"
	}
}
```

__Create your React App__

__Add build folder to .gitignore__

__TODO publish to github pages__

