/**
 * CCR API Environments
 */
export type CcrEnv = 'demo' | 'dev' | 'prod' | 'test'

/**
 * CCR User Roles
 */
export type CcrRol = 'admin' | 'provider' | 'client'

/**
 * CCR Roles Map
 */
export function CcrRolesMap(id: number | string): CcrRol {
  switch (Number(id)) {
    case 1:
      return 'admin'
    case 2:
      return 'provider'
    case 3:
      return 'client'
    default:
      throw new Error(`Unknown CcrRolesMap ${id}`)
  }
}
