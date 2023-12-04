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
  daysheetsFormId: '5',
  remindersFormId: '4',
  physicianFormId: '6',
  wellCoreOrgId: '7535',
  wellcoreMedicalFormId: '7',
  wellcoreMeetingId: 22,
  wellcoreEligibleToSelfSchedulePhaseId: '817'
}
