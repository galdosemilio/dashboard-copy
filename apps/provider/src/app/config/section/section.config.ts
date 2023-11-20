import {
  ApolloEndosurgeryProdSectionConfig,
  ApolloInternationalDemoClinicSectionConfig,
  ApolloUSProdSectionConfig,
  ApolloUSClinicsProdSectionConfig,
  ApolloInternationalSectionConfig
} from './apollo'
import {
  CoachCareClinicProdSectionConfig,
  CoachCareClinicTestSectionConfig
} from './coach-care'
import { CurryCareProdSectionConfig } from './currycare'
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
import { HernriedSectionConfig } from './hernried'
import { InhealthSectionConfig } from './inhealth'
import { LeanMDSectionConfig } from './leanmd/leanmd.section.config'
import { SectionConfigDetails } from './models/section.details'
import { HomeAndThrivingSectionConfig } from './home-and-thriving'
import { RobardSectionConfig } from './robard'
import { ShiftSetGoSectionConfig } from './shiftsetgo/shiftsetgo.section.config'
import { TrueWeightSectionConfig } from './true-weight/true-weight.section.config'
import {
  IdealYouTestSectionConfig,
  IdealYouProdSectionConfig
} from './ideal-you'
import { GardenStatePainSectionConfig } from './garden-state'
import { NXTSTIMSectionConfig } from './nxtstim'
import { AlaskaPremierSectionConfig } from './alaska-premier'
import { WakeForestSectionConfig } from './wake-forest'
import {
  DonnaKrechOnlineProdSectionConfig,
  DonnaKrechOnlineTestSectionConfig
} from './donna-krech-online'
import { SharpProdSectionConfig, SharpTestSectionConfig } from './sharp'
import { OptionsMedicalWeightLossSectionConfig } from './options-medical-weight-loss'
import { BonsSecourMercySectionConfig } from './bons-secour'
import { ChapSectionConfig } from './chap'
import { ConciSectionConfig } from './conci'

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
    ['3328']: SharpTestSectionConfig,
    ['3381']: LeanMDSectionConfig,
    ['3440']: ConciSectionConfig,
    ['31']: CoachCareClinicTestSectionConfig,
    ['7016']: RobardSectionConfig,
    ['7242']: InhealthSectionConfig,
    ['7262']: FullyAliveTestSectionConfig,
    ['7355']: ShiftSetGoSectionConfig,
    ['7532']: HomeAndThrivingSectionConfig,
    ['7536']: HernriedSectionConfig,
    ['7546']: NXTSTIMSectionConfig,
    ['7554']: GardenStatePainSectionConfig,
    ['7614']: DonnaKrechOnlineTestSectionConfig
  },
  prod: {
    ['4050']: LeanMDSectionConfig,
    ['4061']: ApolloEndosurgeryProdSectionConfig,
    ['4066']: CoachCareClinicProdSectionConfig,
    ['4072']: InhealthSectionConfig,
    ['4118']: RobardSectionConfig,
    ['4123']: FullyAliveProdSectionConfig,
    ['6375']: ApolloInternationalDemoClinicSectionConfig,
    ['5329']: ApolloUSProdSectionConfig,
    ['5336']: DonnaKrechOnlineProdSectionConfig,
    ['5341']: ApolloInternationalSectionConfig,
    ['5544']: IdealYouProdSectionConfig,
    ['6504']: ApolloUSClinicsProdSectionConfig,
    ['5470']: GrandViewHealthSectionConfig,
    ['5529']: ShiftSetGoSectionConfig,
    ['5595']: TrueWeightSectionConfig,
    ['6439']: DrVProdSectionConfig,
    ['4049']: CurryCareProdSectionConfig,
    ['6869']: HomeAndThrivingSectionConfig,
    ['6475']: HernriedSectionConfig,
    ['7032']: GardenStatePainSectionConfig,
    ['7054']: ConciSectionConfig,
    ['7074']: NXTSTIMSectionConfig,
    ['7080']: AlaskaPremierSectionConfig,
    ['7227']: WakeForestSectionConfig,
    ['7277']: SharpProdSectionConfig,
    ['7327']: OptionsMedicalWeightLossSectionConfig,
    ['7233']: BonsSecourMercySectionConfig,
    ['7337']: ChapSectionConfig
  }
}
