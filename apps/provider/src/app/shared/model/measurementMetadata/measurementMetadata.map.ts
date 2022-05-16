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
              name: 'General Pain Relief'
            },
            viewValue: _('MEASUREMENT.GENERAL_PAIN_RELIEF')
          },
          {
            value: {
              id: '2',
              name: 'Advanced Pain Relief'
            },
            viewValue: _('MEASUREMENT.ADVANCED_PAIN_RELIEF')
          },
          {
            value: {
              id: '3',
              name: 'Mixed Frequency'
            },
            viewValue: _('MEASUREMENT.MIXED_FREQUENCY')
          },
          {
            value: {
              id: '4',
              name: 'Deep Stimulus - Basic'
            },
            viewValue: _('MEASUREMENT.DEEP_STIMULUS_BASIC')
          },
          {
            value: {
              id: '5',
              name: 'Deep Stimulus - Advanced'
            },
            viewValue: _('MEASUREMENT.DEEP_STIMULUS_ADVANCED')
          },
          {
            value: {
              id: '6',
              name: 'Pain Block'
            },
            viewValue: _('MEASUREMENT.PAIN_BLOCK')
          },
          {
            value: {
              id: '7',
              name: 'Thorough Stimulus - Mild'
            },
            viewValue: _('MEASUREMENT.THOROUGH_STIMULUS_MILD')
          },
          {
            value: {
              id: '8',
              name: 'Thorough Stimulus - Moderate'
            },
            viewValue: _('MEASUREMENT.THOROUGH_STIMULUS_MODERATE')
          },
          {
            value: {
              id: '9',
              name: 'Thorough Stimulus - Advanced'
            },
            viewValue: _('MEASUREMENT.THOROUGH_STIMULUS_ADVANCED')
          },
          {
            value: {
              id: '10',
              name: 'Pain Relief Massage - Pounding'
            },
            viewValue: _('MEASUREMENT.PAIN_RELIEF_MASSAGE_POUNDING')
          },
          {
            value: {
              id: '11',
              name: 'Pain Relief Massage - Combination of rubbing and pounding'
            },
            viewValue: _('MEASUREMENT.PAIN_RELIEF_MASSAGE_RUBBING_POUNDING')
          },
          {
            value: {
              id: '12',
              name: 'Deep Burst - Basic'
            },
            viewValue: _('MEASUREMENT.DEEP_BURST_BASIC')
          },
          {
            value: {
              id: '13',
              name: 'Deep Burst - Advanced'
            },
            viewValue: _('MEASUREMENT.DEEP_BURST_ADVANCED')
          },
          {
            value: {
              id: '14',
              name: 'Muscle Stimulation Flux - Basic'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STIMULATION_FLUX_BASIC')
          },
          {
            value: {
              id: '15',
              name: 'Muscle Stimulation Flux - Advanced'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STIMULATION_FLUX_ADVANCED')
          },
          {
            value: {
              id: '16',
              name: 'Sore Muscle Massage'
            },
            viewValue: _('MEASUREMENT.SORE_MUSCLE_MASSAGE')
          },
          {
            value: {
              id: '17',
              name: 'Muscle Stimulation Bounce'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STIMULATION_BOUNCE')
          },
          {
            value: {
              id: '18',
              name: 'Back of Neck Pain Relief'
            },
            viewValue: _('MEASUREMENT.BACK_OF_NECK_PAIN_RELIEF')
          },
          {
            value: {
              id: '19',
              name: 'Back Pain Relief'
            },
            viewValue: _('MEASUREMENT.BACK_PAIN_RELIEF')
          },
          {
            value: {
              id: '20',
              name: 'Muscle Stimulation Pulse'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STIMULATION_PULSE')
          },
          {
            value: {
              id: '21',
              name: 'Lower Leg Muscle Stimulation Flow - Basic'
            },
            viewValue: _('MEASUREMENT.LOWER_LEG_MUSCLE_STIMULATION_BASIC')
          },
          {
            value: {
              id: '22',
              name: 'Lower Leg Muscle Stimulation Flow - Advanced'
            },
            viewValue: _('MEASUREMENT.LOWER_LEG_MUSCLE_STIMULATION_ADVANCED')
          },
          {
            value: {
              id: '23',
              name: 'Muscle Strengthening - Basic'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STRENGTHENING_BASIC')
          },
          {
            value: {
              id: '24',
              name: 'Muscle Strengthening - Intermediate'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STRENGTHENING_INTERMEDIATE')
          },
          {
            value: {
              id: '25',
              name: 'Muscle Strengthening - Advanced'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STRENGTHENING_ADVANCED')
          },
          {
            value: {
              id: '26',
              name: 'Improve Muscle Performance & Endurance - Basic'
            },
            viewValue: _('MEASUREMENT.IMPROV_MUSCLE_PERF_END_BASIC')
          },
          {
            value: {
              id: '27',
              name: 'Improve Muscle Performance & Endurance - Intermediate'
            },
            viewValue: _('MEASUREMENT.IMPROV_MUSCLE_PERF_END_INTERMEDIATE')
          },
          {
            value: {
              id: '28',
              name: 'Improve Muscle Performance & Endurance - Advanced'
            },
            viewValue: _('MEASUREMENT.IMPROV_MUSCLE_PERF_END_ADVANCED')
          },
          {
            value: {
              id: '29',
              name: 'Complete Massage'
            },
            viewValue: _('MEASUREMENT.COMPLETE_MASSAGE')
          },
          {
            value: {
              id: '30',
              name: 'Muscle Stimulation Wave'
            },
            viewValue: _('MEASUREMENT.MUSCLE_STIMULATION_WAVE')
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
