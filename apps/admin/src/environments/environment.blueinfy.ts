import { AppEnvironment } from '@coachcare/common/shared'

export const environment: AppEnvironment = {
  apiUrl: 'https://blueinfy.api.coachcare.com/',
  appName: 'ccr-web',
  appVersion: '1.0',
  ccrApiEnv: 'blueinfy',
  cookieDomain: 'blueinfy.api.coachcare.com',
  production: true,
  stripeKey: 'pk_test_q5X8FrXn7vv7p3E5STRXFvtv',
  cdn: 'http://blueinfy.assets.cc.s3-website-us-east-1.amazonaws.com/',
  url: 'https://blueinfy.dashboard.coachcare.com',
  defaultOrgId: '1',
  wellcoreOrgId: '1',
  wellcoreUrl: 'https://blueinfy.my.teamwellcore.com',
  wellcoreEcommerceHost: 'https://wellcore-test.ecommerce.coachcare.com'
}
