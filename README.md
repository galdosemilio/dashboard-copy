# Dashboard

This project was generated using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Development server

Run `yarn start:admin` and `yarn start:provider` to serve the Admin Site project and the Provider Site project, respectively. The Admin Site project is served on http://localhost:4200/, while the Provider Site project is served on http://localhost:4201/.

You can also run `yarn start:chart` to serve the Measurement Charts project on http://localhost:4202/.

## Build

Building is particularly useful to make sure that your apps are not having issues with AOT compiling and/or some minor imports/linting issues. This is the most efficient way of knowing if a dependency update broke your application so please make sure to run this if you make big changes to the monorepo.

This is how you build each project for testing:

- Admin Site: `yarn build admin -c test`
- Provider Site: `yarn build provider -c test`
- Measurement Charts: `yarn build measurement-charts -c test`

## Running unit tests

Although we don't extensively use Unit Testing in this project, there are definitely some tests around certain services, particularly on the Provider Site project.

Here's how you'd run them:

- Admin Site: `nx test provider`
- Provider Site: `nx test admin`
- Measurement Charts: `nx test measurement-charts`

As a rule of thumb:

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

To run tests using the Cypress window (with watch enabled):

- Admin Site: `yarn test:admin`
- Provider Site: `yarn test:provider`

To run ALL tests in a headless browser:

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

- Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## i18n translation strings

- start by creating a translation for the appropriate strings in each of the base files https://github.com/coachcare/dashboard/tree/master/apps/provider/src/assets/i18n/base. Note that this is for the provider site. The unauthenticated and admin site pages are in the `/admin` and not `/provider` path segment. There’s no exact method as to where in the JSON object you should put the new translations, but look for where other translation strings on the page/components your working on are located - use your best judgement
- Just use google translate to create the translations from the english version
- Once you have the translation in each of the base files, add the translation strings to the HTML template or component. You will see a lot of examples of how to format this, since most of the text on the website uses translation strings
- Then, run yarn extract. This will scan the template and component files to find all in-use i18n strings (it searches by JSON object path). For all found uses, it will extract the translation from the base i18n files, and update the localized versions of the i18n files in the main https://github.com/coachcare/dashboard/tree/master/apps/provider/src/assets/i18n folder. You should see that all of those files have a change after you have run yarn extract
- If you find that you run yarn extract and the localized i18n files are not updated, it is probably because the yarn extract task did not locate a JSON path in any of the template or component files. Check to make sure that the JSON path references the new translation you added in the base file, update as needed, and run yarn extract again.
