# Sustainability Monitor

This project was generated with Angular CLI version 13.2.0.

## Get started

### Clone the repo

```shell
git clone https://github.com/sustainabilitymonitor/beta.git
cd beta/Projects/ClientSide/Website
```

### Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
npm start
```

The `npm start` command builds (compiles TypeScript and copies assets) the application into `dist/`, watches for changes to the source files, and runs `lite-server` on port `4200`.

Shut it down manually with `Ctrl-C`.

#### npm scripts

These are the most useful commands defined in `package.json`:

* `npm start` - runs the TypeScript compiler, asset copier, and a server at the same time, all three in "watch mode".
* `npm run build` - runs the TypeScript compiler and asset copier once.
* `npm run build:watch` - runs the TypeScript compiler and asset copier in "watch mode"; when changes occur to source files, they will be recompiled or copied into `dist/`.
* `npm run lint` - runs `tslint` on the project files.
* `npm run serve` - runs `lite-server`.

These are the test-related scripts:

* `npm test` - builds the application and runs Intern tests (both unit and functional) one time.
* `npm run ci` - cleans, lints, and builds the application and runs Intern tests (both unit and functional) one time.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## template logic and structure

1. `layout` folder:
    - The `layout` folder contains the main layout file for your Angular project's landing page. This file is responsible for rendering the overall structure and design of your landing page. It typically includes the header, footer, and main content areas of the home page.
    - Inside the layout folder, you may find several files including HTML, CSS, and TypeScript files. The HTML file defines the structure of your landing page and includes placeholders for dynamic content that will be loaded by the Angular framework. The CSS file defines the styling of your landing page, including fonts, colors, and layout. The TypeScript file includes the logic that controls the behavior of your landing page, such as handling user interactions and retrieving data from APIs.

2. `layout2` folder:
    - The `layout2` folder contains a dynamic navigation bar that can be used to navigate throughout your Angular project. This navigation bar is typically included in the header section of your landing page and allows users to quickly access different sections of your application.
    - Inside the layout2 folder, The HTML file defines the structure of your navigation bar and includes links to different sections of your application. The CSS file defines the styling of your navigation bar, including colors, fonts, and layout. The TypeScript file includes the logic that controls the behavior of your navigation bar, such as highlighting the current page and handling user clicks.

By separating your landing page layout and navigation bar into two separate folders, you can easily update and maintain each section of your Angular project without affecting the other. This can make it easier to manage your codebase and improve the overall quality of your application.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

