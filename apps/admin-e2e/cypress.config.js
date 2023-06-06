const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'uxcakh',
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/admin-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/admin-e2e/screenshots',
  chromeWebSecurity: false,
  env: {
    adminId: '2180',
    patientId: '6784',
    organizationId: '3378',
    providerId: '5606',
    timezone: 'et'
  },
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
    specPattern: './src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts'
  }
})
