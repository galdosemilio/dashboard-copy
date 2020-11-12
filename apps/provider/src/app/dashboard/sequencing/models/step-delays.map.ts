import { _ } from '@app/shared/utils'

export interface StepDelay {
  displayName: string
  id: string
  name: string
}

export const StepDelays: { [key: string]: StepDelay } = {
  ['no-delay']: {
    id: '',
    name: 'no delay',
    displayName: _('SEQUENCING.DELAYS.NO_DELAY')
  },
  ['1day']: {
    id: '1',
    name: '1 day',
    displayName: _('SEQUENCING.DELAYS.1_DAY')
  },
  ['2days']: {
    id: '2',
    name: '2 days',
    displayName: _('SEQUENCING.DELAYS.2_DAYS')
  },
  ['3days']: {
    id: '3',
    name: '3 days',
    displayName: _('SEQUENCING.DELAYS.3_DAYS')
  },
  ['4days']: {
    id: '4',
    name: '4 days',
    displayName: _('SEQUENCING.DELAYS.4_DAYS')
  },
  ['5days']: {
    id: '5',
    name: '5 days',
    displayName: _('SEQUENCING.DELAYS.5_DAYS')
  },
  ['6days']: {
    id: '6',
    name: '6 days',
    displayName: _('SEQUENCING.DELAYS.6_DAYS')
  },
  ['7days']: {
    id: '7',
    name: '7 days',
    displayName: _('SEQUENCING.DELAYS.7_DAYS')
  },
  ['8days']: {
    id: '8',
    name: '8 days',
    displayName: _('SEQUENCING.DELAYS.8_DAYS')
  },
  ['9days']: {
    id: '9',
    name: '9 days',
    displayName: _('SEQUENCING.DELAYS.9_DAYS')
  },
  ['10days']: {
    id: '10',
    name: '10 days',
    displayName: _('SEQUENCING.DELAYS.10_DAYS')
  },
  ['11days']: {
    id: '11',
    name: '11 days',
    displayName: _('SEQUENCING.DELAYS.11_DAYS')
  },
  ['12days']: {
    id: '12',
    name: '12 days',
    displayName: _('SEQUENCING.DELAYS.12_DAYS')
  },
  ['13days']: {
    id: '13',
    name: '13 days',
    displayName: _('SEQUENCING.DELAYS.13_DAYS')
  },
  ['14days']: {
    id: '14',
    name: '14 days',
    displayName: _('SEQUENCING.DELAYS.14_DAYS')
  },
  ['15days']: {
    id: '15',
    name: '15 days',
    displayName: _('SEQUENCING.DELAYS.15_DAYS')
  }
}
