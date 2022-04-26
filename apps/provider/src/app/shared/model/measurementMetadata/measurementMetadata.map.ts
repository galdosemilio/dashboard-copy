import { SelectOption, _ } from '@app/shared/utils'
import { DataPointTypes, NamedEntity } from '@coachcare/sdk'

export interface MeasurementMetadataProp {
  name: string
  payloadRoute: string
  displayName: string
  options: SelectOption<string | NamedEntity>[]
}

export interface MeasurementMetadataEntry {
  dataPointTypes: DataPointTypes[]
  properties: MeasurementMetadataProp[]
}

export const MEASUREMENT_METADATA_MAP: Record<
  string,
  MeasurementMetadataEntry
> = {
  nxtstim: {
    /** Data types that will enable the NXTSTIM metadata */
    dataPointTypes: [
      DataPointTypes.NXTSTIM_CURE_INTENSITY,
      DataPointTypes.NXTSTIM_GRADE,
      DataPointTypes.NXTSTIM_PAIN_INTENSITY,
      DataPointTypes.NXTSTIM_SESSION_DURATION
    ],

    /**
     * The metadata properties that will be presented on the table AND
     * on the add measurements component
     */
    properties: [
      {
        name: 'bodyLocation',
        payloadRoute: 'metadata.nxtstim.bodyLocation',
        displayName: _('MEASUREMENT.BODY_LOCATION'),
        options: [
          {
            value: {
              id: '1',
              name: 'Shoulder'
            },
            viewValue: _('MEASUREMENT.SHOULDER')
          },
          {
            value: {
              id: '2',
              name: 'Upper back'
            },
            viewValue: _('MEASUREMENT.UPPER_BACK')
          },
          {
            value: {
              id: '3',
              name: 'Back'
            },
            viewValue: _('MEASUREMENT.BACK')
          },
          {
            value: {
              id: '4',
              name: 'Lower back'
            },
            viewValue: _('MEASUREMENT.LOWER_BACK')
          },
          {
            value: {
              id: '5',
              name: 'Abdomen'
            },
            viewValue: _('MEASUREMENT.ABDOMEN')
          },
          {
            value: {
              id: '6',
              name: 'Buttock'
            },
            viewValue: _('MEASUREMENT.BUTTOCK')
          },
          {
            value: {
              id: '7',
              name: 'Thigh'
            },
            viewValue: _('MEASUREMENT.THIGH')
          },
          {
            value: {
              id: '8',
              name: 'Knee'
            },
            viewValue: _('MEASUREMENT.KNEE')
          },
          {
            value: {
              id: '9',
              name: 'Calf'
            },
            viewValue: _('MEASUREMENT.CALF')
          },
          {
            value: {
              id: '10',
              name: 'Ankle'
            },
            viewValue: _('MEASUREMENT.ANKLE')
          },
          {
            value: {
              id: '11',
              name: 'Foot'
            },
            viewValue: _('MEASUREMENT.FOOT')
          },
          {
            value: {
              id: '12',
              name: 'Upper arm'
            },
            viewValue: _('MEASUREMENT.UPPER_ARM')
          },
          {
            value: {
              id: '13',
              name: 'Elbow'
            },
            viewValue: _('MEASUREMENT.ELBOW')
          },
          {
            value: {
              id: '14',
              name: 'Forearm'
            },
            viewValue: _('MEASUREMENT.FOREARM')
          },
          {
            value: {
              id: '15',
              name: 'Wrist'
            },
            viewValue: _('MEASUREMENT.WRIST')
          }
        ]
      },
      {
        name: 'program',
        payloadRoute: 'metadata.nxtstim.program',
        displayName: _('MEASUREMENT.PROGRAM'),
        options: [
          {
            value: {
              id: '1',
              name: 'Pain alleviation 1'
            },
            viewValue: _('MEASUREMENT.PAIN_ALLEVIATION_1')
          },
          {
            value: {
              id: '2',
              name: 'Pain alleviation 2'
            },
            viewValue: _('MEASUREMENT.PAIN_ALLEVIATION_2')
          },
          {
            value: {
              id: '3',
              name: 'Joint pain alleviation'
            },
            viewValue: _('MEASUREMENT.JOINT_PAIN_ALLEVIATION')
          },
          {
            value: {
              id: '4',
              name: 'Acute pain alleviation'
            },
            viewValue: _('MEASUREMENT.ACUTE_PAIN_ALLEVIATION')
          },
          {
            value: {
              id: '5',
              name: 'Very acute pain alleviation'
            },
            viewValue: _('MEASUREMENT.VERY_ACUTE_PAIN_ALLEVIATION')
          },
          {
            value: {
              id: '6',
              name: 'Endorphin stimulation'
            },
            viewValue: _('MEASUREMENT.ENDORPHIN_STIMULATION')
          },
          {
            value: {
              id: '7',
              name: 'Chronic pain alleviation 1'
            },
            viewValue: _('MEASUREMENT.CHRONIC_PAIN_ALLEVIATION_1')
          },
          {
            value: {
              id: '8',
              name: 'Chronic pain alleviation 2'
            },
            viewValue: _('MEASUREMENT.CHRONIC_PAIN_ALLEVIATION_2')
          },
          {
            value: {
              id: '9',
              name: 'Chronic pain alleviation 3'
            },
            viewValue: _('MEASUREMENT.CHRONIC_PAIN_ALLEVIATION_3')
          },
          {
            value: {
              id: '10',
              name: 'Pounding away pain'
            },
            viewValue: _('MEASUREMENT.POUNDING_AWAY_PAIN')
          },
          {
            value: {
              id: '11',
              name: 'Rubbing and pummeling'
            },
            viewValue: _('MEASUREMENT.RUBBING_AND_PUMMELING')
          },
          {
            value: {
              id: '12',
              name: 'Muscle stress alleviation 1'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STRESS_ALLEVIATION_1')
          },
          {
            value: {
              id: '13',
              name: 'Muscle stress relief 2'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STRESS_RELIEF_2')
          },
          {
            value: {
              id: '14',
              name: 'Muscle loss alleviation 1'
            },
            viewValue: _('MEASUREMENT.MUSCLE_LOSS_ALLEVIATION_1')
          },
          {
            value: {
              id: '15',
              name: 'Muscle loss alleviation 2'
            },
            viewValue: _('MEASUREMENT.MUSCLE_LOSS_ALLEVIATION_2')
          },
          {
            value: {
              id: '16',
              name: 'Muscle pull/tear'
            },
            viewValue: _('MEASUREMENT.MUSCLE_PULL_TEAR')
          },
          {
            value: {
              id: '17',
              name: 'Muscle loosening'
            },
            viewValue: _('MEASUREMENT.MUSCLE_LOOSENING')
          },
          {
            value: {
              id: '18',
              name: 'Cervical pain'
            },
            viewValue: _('MEASUREMENT.CERVICAL_PAIN')
          },
          {
            value: {
              id: '19',
              name: 'Back pain'
            },
            viewValue: _('MEASUREMENT.BACK_PAIN')
          },
          {
            value: {
              id: '20',
              name: 'Muscle cramp avoidance'
            },
            viewValue: _('MEASUREMENT.MUSCLE_CRAMP_AVOIDANCE')
          },
          {
            value: {
              id: '21',
              name: 'Arterial inadequacy'
            },
            viewValue: _('MEASUREMENT.ARTERIAL_INADEQUACY')
          },
          {
            value: {
              id: '22',
              name: 'Venous inadequacy'
            },
            viewValue: _('MEASUREMENT.VENOUS_INADEQUACY')
          },
          {
            value: {
              id: '23',
              name: 'Beginner strength building'
            },
            viewValue: _('MEASUREMENT.BEGINNER_STRENGTH_BUILDING')
          },
          {
            value: {
              id: '24',
              name: 'Intermediate strength building'
            },
            viewValue: _('MEASUREMENT.INTERMEDIATE_STRENGTH_BUILDING')
          },
          {
            value: {
              id: '25',
              name: 'Advanced strength building'
            },
            viewValue: _('MEASUREMENT.ADVANCED_STRENGTH_BUILDING')
          },
          {
            value: {
              id: '26',
              name: 'Beginner endurance building'
            },
            viewValue: _('MEASUREMENT.BEGINNER_ENDURANCE_BUILDING')
          },
          {
            value: {
              id: '27',
              name: 'Intermediate endurance building'
            },
            viewValue: _('MEASUREMENT.INTERMEDIATE_ENDURANCE_BUILDING')
          },
          {
            value: {
              id: '28',
              name: 'Advanced endurance building'
            },
            viewValue: _('MEASUREMENT.ADVANCED_ENDURANCE_BUILDING')
          },
          {
            value: {
              id: '29',
              name: 'Thorough relaxation'
            },
            viewValue: _('MEASUREMENT.THOROUGH_RELAXATION')
          },
          {
            value: {
              id: '30',
              name: 'Stress-free massage'
            },
            viewValue: _('MEASUREMENT.STRESS_FREE_MASSAGE')
          }
        ]
      },
      {
        name: 'profileType',
        payloadRoute: 'metadata.nxtstim.profileType',
        displayName: _('MEASUREMENT.PROFILE_TYPE'),
        options: [
          {
            value: 'pain',
            viewValue: _('MEASUREMENT.PAIN')
          },
          {
            value: 'strengthen',
            viewValue: _('MEASUREMENT.STRENGTHEN')
          },
          {
            value: 'relax',
            viewValue: _('MEASUREMENT.RELAX')
          }
        ]
      },
      {
        name: 'therapyState',
        payloadRoute: 'metadata.nxtstim.therapyState',
        displayName: _('MEASUREMENT.THERAPY_STATE'),
        options: [
          {
            value: 'complete',
            viewValue: _('MEASUREMENT.COMPLETE')
          },
          { value: 'partial', viewValue: _('MEASUREMENT.PARTIAL') }
        ]
      }
    ]
  }
}
