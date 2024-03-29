import { BlockOption } from '@coachcare/common/components'
import { AccountTypeIds } from '@coachcare/sdk'
import { environment } from '../../../environments/environment'
import { PackagePriceItem } from '../register/clinic/clinic-packages/model'
import { ApolloIntSectionConfig } from './apollo-int.section.config'
import { ApolloUSSectionConfig } from './apollo-us.section.config'
import { BariatricAdvantageSectionConfig } from './bariatric-adv.section.config'
import {
  CoachCareProdSectionConfig,
  CoachCareTestSectionConfig
} from './coach-care.section.config'
import { DefaultSectionConfig } from './default.section.config'
import { GWLPSectionConfig } from './gwlp.section.config'
import { HealthyTransformationSectionConfig } from './healthy-transformation.config'
import { InHealthSectionConfig } from './inhealth.section.config'
import { ITGSectionConfig } from './itg.section.config'
import { MuscleWiseSectionConfig } from './musclewise.section.config'
import { NutrimostSectionConfig } from './nutrimost.section.config'
import { NXTSTIMSectionConfig } from './nxtstim.section.config'
import {
  RobardProdSectionConfig,
  RobardTestSectionConfig
} from './robard.section.config'
import { ShakeItSectionConfig } from './shake-it.section.config'
import { WellCoreSectionConfig } from './wellcore.section.config'
import { BeSlimSectionConfig } from './be-slim.section.config'

export interface LoginConfigDetails {
  SHOW_REGISTER_NEW_COMPANY: boolean
  USE_COOKIE_BASED_SESSION: boolean
}

export interface CustomCheckboxConfig {
  text: string
  fieldName: string
  links?: { text: string; url: string; classes?: string }[]
  supportedAccTypes: AccountTypeIds[]
}

export interface RegisterConfigDetails {
  CLINIC_PLANS?: PackagePriceItem[]
  HEADER?: any
  SHOW_REGISTER_ICON?: boolean
  HEADER_TITLE?: any
  INFO?: RegisterFirstStepDetails
  LAST_STEP?: any
  MOB_APP_TYPE?: BlockOption[]
  NEWSLETTER_CHECKBOX?: boolean
  OPEN_ASSOC_ADD_CLIENT?: boolean
  REDIRECT_ON_CLINIC_REGISTRATION?: boolean
  CLINIC_PW_RES_CUSTOM_CHECKBOX?: CustomCheckboxConfig
  CLINIC_MSA?: boolean
  CLINIC_MSA_LINK?: string
  CLINIC_MSA_LINK_LABEL?: string
  CUSTOM_FOOTER_TEXT?: string
  SELF_REGISTER?: boolean
}

export interface RegisterFirstStepDetails {
  PACKAGE?: any
  DESCRIPTION?: any
  PRIORITY_COUNTRY?: Array<string>
}

export interface CheckoutDetails {
  AUTOMATIC_SHOPIFY_REDIRECT?: boolean
}

export interface SectionConfigDetails {
  REGISTER?: RegisterConfigDetails
  LOGIN?: LoginConfigDetails
  CHECKOUT?: CheckoutDetails
}

export interface SectionConfigItem {
  [key: string]: SectionConfigDetails
}

export interface SectionConfig {
  default: SectionConfigDetails
  test?: SectionConfigItem
  prod?: SectionConfigItem
}

export const SECTION_CONFIG: SectionConfig = {
  default: DefaultSectionConfig,
  test: {
    ['7058']: ApolloIntSectionConfig,
    ['7059']: ApolloUSSectionConfig,
    ['7228']: BariatricAdvantageSectionConfig,
    ['30']: CoachCareTestSectionConfig,
    ['7221']: GWLPSectionConfig,
    ['7341']: HealthyTransformationSectionConfig,
    ['7242']: InHealthSectionConfig,
    ['7185']: ITGSectionConfig,
    ['7229']: NutrimostSectionConfig,
    ['7016']: RobardTestSectionConfig,
    ['5748']: ShakeItSectionConfig,
    ['7535']: WellCoreSectionConfig,
    ['7537']: MuscleWiseSectionConfig,
    ['7546']: NXTSTIMSectionConfig,
    ['7618']: BeSlimSectionConfig
  },
  prod: {
    ['5341']: ApolloIntSectionConfig,
    ['6504']: ApolloUSSectionConfig,
    ['6153']: BariatricAdvantageSectionConfig,
    ['3637']: CoachCareProdSectionConfig,
    ['5489']: GWLPSectionConfig,
    ['6247']: HealthyTransformationSectionConfig,
    ['4072']: InHealthSectionConfig,
    ['5481']: ITGSectionConfig,
    ['5604']: NutrimostSectionConfig,
    ['4118']: RobardProdSectionConfig,
    ['4156']: ShakeItSectionConfig,
    ['6916']: MuscleWiseSectionConfig,
    ['6891']: WellCoreSectionConfig,
    ['7074']: NXTSTIMSectionConfig,
    ['7267']: BeSlimSectionConfig
  }
}

export function resolveConfig(
  route: string,
  orgId: string = environment.defaultOrgId,
  direct: boolean = false
): any {
  const env: string = environment.ccrApiEnv === 'prod' ? 'prod' : 'test'
  let config
  let defaultConfig
  config = SECTION_CONFIG[env][orgId]
  defaultConfig = SECTION_CONFIG.default

  if (direct) {
    config = SECTION_CONFIG[env][orgId] ? { ...SECTION_CONFIG[env][orgId] } : {}

    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        config = config ? config[segment] : undefined
      })

    return config
  } else {
    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        defaultConfig = defaultConfig ? defaultConfig[segment] : undefined
        config = config ? config[segment] : undefined
      })

    return config ?? defaultConfig ?? {}
  }
}
