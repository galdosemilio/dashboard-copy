import { Environment } from './environment.interface'

export const environment: Environment = {
  apiUrl: 'https://test.api.coachcare.com/',
  appName: 'ccr-web',
  cookieDomain: 'test.api.coachcare.com',
  loginSite: 'http://localhost:4200',
  production: false,
  role: 'provider',
  selveraApiEnv: 'test',
  url: 'http://localhost:4201',
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
