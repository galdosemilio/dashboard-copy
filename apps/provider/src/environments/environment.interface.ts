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
  selveraApiEnv: 'ccrDemo' | 'dev' | 'prod' | 'test'
  url: string
  awsAssetsUrl: string
  coachcareOrgId: string
}
