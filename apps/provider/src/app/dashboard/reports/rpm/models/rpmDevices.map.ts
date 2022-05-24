import { _ } from '@app/shared/utils'

export interface RPMDevice {
  id: string
  imageClass?: string
  imageSrc?: string
  displayName: string
  name: string
  sortOrder?: number
}

export const RPM_DEVICES: RPMDevice[] = [
  {
    id: '1',
    name: 'BALANCE Smart Scale',
    displayName: _('RPM.SCALE'),
    imageSrc: 'assets/img/balance-scale.png',
    imageClass: 'rpm-scale',
    sortOrder: 1
  },
  {
    id: '2',
    name: 'BEAT Blood Pressure Cuff',
    displayName: _('RPM.BP_CUFF'),
    imageSrc: 'assets/img/bloodpresscuff.png',
    imageClass: 'bp-cuff',
    sortOrder: 2
  },
  {
    id: '3',
    name: 'SCAN Smart Glucometer',
    displayName: _('RPM.SCAN_SMART_GLUCOMETER'),
    imageSrc: 'assets/img/glucometer.png'
  },
  {
    id: '4',
    name: 'Pulse Oximeter',
    displayName: _('RPM.PULSE_OXIMETER'),
    imageSrc: 'assets/img/oximeter.png',
    sortOrder: 4
  },
  {
    id: '-1',
    name: 'None',
    displayName: _('RPM.NONE'),
    imageSrc: '',
    sortOrder: -1 // means it will go at the end of the list
  }
]
