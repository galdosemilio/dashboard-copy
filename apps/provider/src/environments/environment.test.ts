import { Environment } from './environment.interface'

export const environment: Environment = {
  apiUrl: 'https://test.api.coachcare.com/',
  appName: 'ccr-web',
  cookieDomain: 'test.api.coachcare.com',
  loginSite: 'https://test.dashboard.coachcare.com',
  production: true,
  role: 'provider',
  selveraApiEnv: 'test',
  url: 'https://test.dashboard.coachcare.com/provider',
  awsAssetsUrl: 'https://s3.amazonaws.com/dev.assets.cc',
  coachcareOrgId: '30',
  daysheetsFormId: '15121',
  remindersFormId: '15081',
  physicianFormId: '15096',
  wellCoreOrgId: '7535',
  wellcoreMedicalFormId: '15189',
  wellcoreMeetingId: 22,
  wellcoreEligibleToSelfSchedulePhaseId: '817'
}
