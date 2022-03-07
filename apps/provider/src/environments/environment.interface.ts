/**
 * Environment Template
 */
export interface Environment {
  apiUrl: string | undefined
  appName: string
  cookieDomain: string
  loginSite: string
  production: boolean
  role: string
  selveraApiEnv: 'ccrDemo' | 'dev' | 'prod' | 'test' | 'blueinfy'
  url: string
  awsAssetsUrl: string
  coachcareOrgId: string
  wellCoreOrgId: string
  wellcoreMedicalFormId: string
  wellcoreMeetingId: number
  wellcoreEligibleToSelfSchedulePhaseId: string
}
