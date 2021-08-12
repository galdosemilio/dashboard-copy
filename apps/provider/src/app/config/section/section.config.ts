import {
  ApolloEndosurgeryProdSectionConfig,
  ApolloEndosurgeryTestSectionConfig,
  ApolloInternationalDemoClinicSectionConfig,
  ApolloUSProdSectionConfig,
  ApolloUSTestSectionConfig,
  ApolloUSClinicsProdSectionConfig,
  ApolloUSClinicsTestSectionConfig,
  ApolloInternationalSectionConfig
} from './apollo'
import {
  CenterForMedicalWeightLossProdSectionConfig,
  CenterForMedicalWeightLossTestSectionConfig
} from './center'
import {
  CoachCareClinicProdSectionConfig,
  CoachCareClinicTestSectionConfig
} from './coach-care'
import {
  CurryCareProdSectionConfig,
  CurryCareTestSectionConfig
} from './currycare'
import {
  DefaultProdSectionConfig,
  DefaultTestSectionConfig
} from './default.section.config'
import { DrVProdSectionConfig } from './dr-v'
import {
  FullyAliveProdSectionConfig,
  FullyAliveTestSectionConfig
} from './fully-alive'
import { GrandViewHealthSectionConfig } from './grand-view'
import { InhealthSectionConfig } from './inhealth'
import { LeanMDSectionConfig } from './leanmd/leanmd.section.config'
import { MDTeamSectionConfig } from './mdteam'
import {
  ShakeItProdSectionConfig,
  ShakeItTestSectionConfig
} from './metagenics'
import { SectionConfigDetails } from './models/section.details'
import { PeakHealthGroupSectionConfig } from './peak-health-group'
import { RobardSectionConfig } from './robard'
import { ShiftSetGoSectionConfig } from './shiftsetgo/shiftsetgo.section.config'
import { TrueWeightSectionConfig } from './true-weight/true-weight.section.config'
import {
  IdealYouTestSectionConfig,
  IdealYouProdSectionConfig
} from './ideal-you'

export interface SectionConfigObject {
  component: any
  props?: any
  values?: any
}

export interface SectionConfigItem {
  [key: string]: SectionConfigDetails
}

export interface SectionConfig {
  default: SectionConfigItem
  test?: SectionConfigItem
  prod?: SectionConfigItem
}

export const SECTION_CONFIG: SectionConfig = {
  default: {
    test: DefaultTestSectionConfig,
    prod: DefaultProdSectionConfig
  },
  test: {
    ['3235']: IdealYouTestSectionConfig,
    ['3381']: LeanMDSectionConfig,
    ['4479']: ApolloEndosurgeryTestSectionConfig,
    ['5748']: ShakeItTestSectionConfig,
    ['6955']: CenterForMedicalWeightLossTestSectionConfig,
    ['31']: CoachCareClinicTestSectionConfig,
    ['7016']: RobardSectionConfig,
    ['7521']: ApolloInternationalDemoClinicSectionConfig,
    ['7058']: ApolloInternationalSectionConfig,
    ['7059']: ApolloUSTestSectionConfig,
    ['7517']: ApolloUSClinicsTestSectionConfig,
    ['7242']: InhealthSectionConfig,
    ['7262']: FullyAliveTestSectionConfig,
    ['7355']: ShiftSetGoSectionConfig,
    ['7353']: TrueWeightSectionConfig,
    ['7420']: GrandViewHealthSectionConfig,
    ['7384']: MDTeamSectionConfig,
    ['7520']: CurryCareTestSectionConfig,
    ['7534']: PeakHealthGroupSectionConfig
  },
  prod: {
    ['4050']: LeanMDSectionConfig,
    ['4061']: ApolloEndosurgeryProdSectionConfig,
    ['4066']: CoachCareClinicProdSectionConfig,
    ['4072']: InhealthSectionConfig,
    ['4118']: RobardSectionConfig,
    ['4119']: CenterForMedicalWeightLossProdSectionConfig,
    ['4123']: FullyAliveProdSectionConfig,
    ['4156']: ShakeItProdSectionConfig,
    ['6375']: ApolloInternationalDemoClinicSectionConfig,
    ['5329']: ApolloUSProdSectionConfig,
    ['5341']: ApolloInternationalSectionConfig,
    ['5544']: IdealYouProdSectionConfig,
    ['6504']: ApolloUSClinicsProdSectionConfig,
    ['5470']: GrandViewHealthSectionConfig,
    ['5529']: ShiftSetGoSectionConfig,
    ['5595']: TrueWeightSectionConfig,
    ['6438']: MDTeamSectionConfig,
    ['6439']: DrVProdSectionConfig,
    ['4049']: CurryCareProdSectionConfig,
    ['6869']: PeakHealthGroupSectionConfig
  }
}
