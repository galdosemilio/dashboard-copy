import { _ } from '@app/shared/utils'

export interface SequenceHour {
  displayName: string
  value: string
}

export const SEQUENCE_HOURS = [
  {
    displayName: _('SEQUENCING.HOURS.MIDNIGHT'),
    value: '00:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.1_AM'),
    value: '01:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.2_AM'),
    value: '02:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.3_AM'),
    value: '03:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.4_AM'),
    value: '04:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.5_AM'),
    value: '05:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.6_AM'),
    value: '06:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.7_AM'),
    value: '07:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.8_AM'),
    value: '08:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.9_AM'),
    value: '09:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.10_AM'),
    value: '10:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.11_AM'),
    value: '11:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.12_PM'),
    value: '12:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.1_PM'),
    value: '13:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.2_PM'),
    value: '14:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.3_PM'),
    value: '15:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.4_PM'),
    value: '16:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.5_PM'),
    value: '17:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.6_PM'),
    value: '18:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.7_PM'),
    value: '19:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.8_PM'),
    value: '20:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.9_PM'),
    value: '21:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.10_PM'),
    value: '22:00:00'
  },
  {
    displayName: _('SEQUENCING.HOURS.11_PM'),
    value: '23:00:00'
  }
]
