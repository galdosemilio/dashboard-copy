/**
 * Environment Template
 */
export interface Environment {
  apiUrl: string | undefined
  appName: string
  production: boolean
  role: string
  selveraApiEnv: 'ccrDemo' | 'dev' | 'prod' | 'test'
}
