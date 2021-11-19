import { Environment } from './environment.interface'

export const environment: Environment = {
  apiUrl: 'https://api.coachcare.com/',
  appName: 'ccr-web',
  cookieDomain: 'api.coachcare.com',
  loginSite: 'https://dashboard.coachcare.com',
  production: true,
  role: 'provider',
  selveraApiEnv: 'prod',
  url: 'https://dashboard.coachcare.com/provider',
  awsAssetsUrl: 'https://s3.amazonaws.com/prod.assets.cc',
  coachcareOrgId: '3637',
  wellCoreOrgId: '6891',
  wellcoreMedicalFormId: '831',
  wellcoreMeetingId: 400,
  wellcoreEligibleToSelfSchedulePhaseId: '1522'
}
