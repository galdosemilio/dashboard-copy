import { AppEnvironment } from '@coachcare/common/shared'

export const environment: AppEnvironment = {
  apiUrl: 'https://test.api.coachcare.com/',
  appName: 'ccr-web',
  appVersion: '1.0',
  ccrApiEnv: 'test',
  cookieDomain: 'test.api.coachcare.com',
  production: false,
  stripeKey: 'pk_test_q5X8FrXn7vv7p3E5STRXFvtv',
  cdn: 'https://d3vngy9ttk2wws.cloudfront.net',
  url: 'http://localhost:4200',
  defaultOrgId: '30',
  wellcoreOrgId: '7535',
  wellcoreUrl: 'https://test.my.teamwellcore.com',
  wellcoreEcommerceHost: 'https://wellcore-test.ecommerce.coachcare.com'
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
