import { AppEnvironment } from '@coachcare/common/shared'

export const environment: AppEnvironment = {
  apiUrl: 'https://api.coachcaredev.com/',
  appName: 'ccr-web',
  appVersion: '1.0',
  ccrApiEnv: 'test',
  cookieDomain: 'api.coachcaredev.com',
  production: false,
  stripeKey: 'pk_test_q5X8FrXn7vv7p3E5STRXFvtv',
  cdn: 'https://d3vngy9ttk2wws.cloudfront.net',
  url: 'http://localhost:4200',
  defaultOrgId: '30'
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error'; // Included with Angular CLI.
