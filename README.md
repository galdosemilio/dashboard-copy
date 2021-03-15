# Dashboard

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@dashboard/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## i18n translation strings

- start by creating a translation for the appropriate strings in each of the base files https://github.com/coachcare/dashboard/tree/master/apps/provider/src/assets/i18n/base. Note that this is for the provider site. The unauthenticated and admin site pages are in the `/admin` and not `/provider` path segment. There’s no exact method as to where in the JSON object you should put the new translations, but look for where other translation strings on the page/components your working on are located - use your best judgement
- Just use google translate to create the translations from the english version
- Once you have the translation in each of the base files, add the translation strings to the HTML template or component. You will see a lot of examples of how to format this, since most of the text on the website uses translation strings
- Then, run yarn extract. This will scan the template and component files to find all in-use i18n strings (it searches by JSON object path). For all found uses, it will extract the translation from the base i18n files, and update the localized versions of the i18n files in the main https://github.com/coachcare/dashboard/tree/master/apps/provider/src/assets/i18n folder. You should see that all of those files have a change after you have run yarn extract
- If you find that you run yarn extract and the localized i18n files are not updated, it is probably because the yarn extract task did not locate a JSON path in any of the template or component files. Check to make sure that the JSON path references the new translation you added in the base file, update as needed, and run yarn extract again.
