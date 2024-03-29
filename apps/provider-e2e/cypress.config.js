const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 120000,
  numTestsKeptInMemory: 3,
  viewportWidth: 1280,
  viewportHeight: 720,
  env: {
    clientId: 3,
    clinicId: 1,
    firstContentItemId: '1992',
    secondContentItemId: '1877',
    thirdContentItemId: '1715',
    formId: 1,
    formSubmissionId: 1,
    organizationId: 1,
    providerId: 1,
    providerIdOther: 2,
    sequenceId: 1,
    timezone: 'et',
    baseUrl: 'http://localhost:4200'
  },
  projectId: 'ktdwx5',
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/provider-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/provider-e2e/screenshots',
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 2
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:4200',
    experimentalRunAllSpecs: true,
    specPattern: './src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts'
  }
})
