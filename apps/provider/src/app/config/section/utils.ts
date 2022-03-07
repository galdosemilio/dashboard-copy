import { SelectedOrganization } from '@app/service'
import { environment } from '../../../environments/environment'
import { SECTION_CONFIG } from './section.config'

export function resolveConfig(
  route: string,
  organization: SelectedOrganization,
  direct: boolean = false
): any {
  const env: string = environment.selveraApiEnv === 'prod' ? 'prod' : 'test'
  const path: string[] = organization ? organization.hierarchyPath || [] : []
  let config = {}
  let defaultConfig

  if (direct) {
    config =
      organization && SECTION_CONFIG[env][organization.id]
        ? { ...SECTION_CONFIG[env][organization.id] }
        : {}

    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        config = config ? config[segment] : undefined
      })

    return config
  } else {
    path.reverse().forEach((clinic: string) => {
      config = SECTION_CONFIG[env][clinic]
        ? { ...config, ...SECTION_CONFIG[env][clinic] }
        : config
    })

    defaultConfig = SECTION_CONFIG.default[env]
    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        defaultConfig = defaultConfig ? defaultConfig[segment] : undefined
        config = config ? config[segment] : undefined
      })
    return config !== null
      ? config !== undefined
        ? config
        : defaultConfig !== undefined
        ? defaultConfig
        : {}
      : {}
  }
}
