import { AppEnvironment } from '@coachcare/common/shared'

export const environment: AppEnvironment = {
  apiUrl: 'https://test.api.coachcare.com/',
  appName: 'ccr-web',
  appVersion: '1.0',
  ccrApiEnv: 'test',
  cookieDomain: 'test.api.coachcare.com',
  production: true,
  stripeKey: 'pk_test_q5X8FrXn7vv7p3E5STRXFvtv',
  cdn: 'https://d3vngy9ttk2wws.cloudfront.net',
  url: 'https://test.dashboard.coachcare.com',
  defaultOrgId: '30',
  wellcoreOrgId: '7535',
  wellcoreUrl: 'https://test.my.teamwellcore.com',
  wellcoreEcommerceHost: 'https://wellcore-test.ecommerce.coachcare.com'
}
