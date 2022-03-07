import { Environment } from './environment.interface'

export const environment: Environment = {
  apiUrl: 'https://blueinfy.api.coachcare.com/',
  appName: 'ccr-web',
  cookieDomain: 'blueinfy.api.coachcare.com',
  loginSite: 'https://blueinfy.dashboard.coachcare.com',
  production: true,
  role: 'provider',
  selveraApiEnv: 'blueinfy',
  url: 'https://blueinfy.dashboard.coachcare.com/provider',
  awsAssetsUrl: 'https://s3.amazonaws.com/dev.assets.cc',
  coachcareOrgId: '1',
  wellCoreOrgId: '1',
  wellcoreMedicalFormId: '15189',
  wellcoreMeetingId: 22,
  wellcoreEligibleToSelfSchedulePhaseId: '817'
}
