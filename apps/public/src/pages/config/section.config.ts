import { environment } from '../../../environments/environment';
import { ApolloIntSectionConfig } from './apollo-int.section.config';
import { ApolloUSSectionConfig } from './apollo-us.section.config';
import { BariatricAdvantageSectionConfig } from './bariatric-adv.section.config';
import { CoachCareSectionConfig } from './coach-care.section.config';
import { DefaultSectionConfig } from './default.section.config';
import { GWLPSectionConfig } from './gwlp.section.config';
import { HealthyTransformationSectionConfig } from './healthy-transformation.config';
import { InHealthSectionConfig } from './inhealth.section.config';
import { ITGSectionConfig } from './itg.section.config';
import { NutrimostSectionConfig } from './nutrimost.section.config';
import { RobardSectionConfig } from './robard.section.config';
import { ShakeItSectionConfig } from './shake-it.section.config';

export interface RegisterConfigDetails {
  HEADER?: any;
  SHOW_REGISTER_ICON?: boolean;
  HEADER_TITLE?: any;
  INFO?: RegisterFirstStepDetails;
  LAST_STEP?: any;
  NEWSLETTER_CHECKBOX?: boolean;
  OPEN_ASSOC_ADD_CLIENT?: boolean;
}

export interface RegisterFirstStepDetails {
  PACKAGE?: any;
  DESCRIPTION?: any;
  PRIORITY_COUNTRY?: Array<string>;
}

export interface SectionConfigDetails {
  REGISTER?: RegisterConfigDetails;
}

export interface SectionConfigItem {
  [key: string]: SectionConfigDetails;
}

export interface SectionConfig {
  default: SectionConfigDetails;
  test?: SectionConfigItem;
  prod?: SectionConfigItem;
}

export const SECTION_CONFIG: SectionConfig = {
  default: DefaultSectionConfig,
  test: {
    ['7058']: ApolloIntSectionConfig,
    ['7059']: ApolloUSSectionConfig,
    ['7228']: BariatricAdvantageSectionConfig,
    ['30']: CoachCareSectionConfig,
    ['7221']: GWLPSectionConfig,
    ['7341']: HealthyTransformationSectionConfig,
    ['7242']: InHealthSectionConfig,
    ['7185']: ITGSectionConfig,
    ['7229']: NutrimostSectionConfig,
    ['7016']: RobardSectionConfig,
    ['5748']: ShakeItSectionConfig
  },
  prod: {
    ['5341']: ApolloIntSectionConfig,
    ['5329']: ApolloUSSectionConfig,
    ['6153']: BariatricAdvantageSectionConfig,
    ['3637']: CoachCareSectionConfig,
    ['5489']: GWLPSectionConfig,
    ['6247']: HealthyTransformationSectionConfig,
    ['4072']: InHealthSectionConfig,
    ['5481']: ITGSectionConfig,
    ['5604']: NutrimostSectionConfig,
    ['4118']: RobardSectionConfig,
    ['4156']: ShakeItSectionConfig
  }
};

export function resolveConfig(
  route: string,
  orgId: string = environment.defaultOrgId,
  direct: boolean = false
): any {
  const env: string = environment.ccrApiEnv;
  let config;
  let defaultConfig;
  config = SECTION_CONFIG[env][orgId];
  defaultConfig = SECTION_CONFIG.default;

  if (direct) {
    config = SECTION_CONFIG[env][orgId] ? { ...SECTION_CONFIG[env][orgId] } : {};

    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        config = config ? config[segment] : undefined;
      });

    return config;
  } else {
    route
      .toUpperCase()
      .split('.')
      .forEach((segment: string) => {
        defaultConfig = defaultConfig ? defaultConfig[segment] : undefined;
        config = config ? config[segment] : undefined;
      });
    return config !== null ? config || defaultConfig : {};
  }
}
