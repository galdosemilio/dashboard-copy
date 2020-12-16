import { _ } from '@app/shared/utils'

export interface RPMDevice {
  id: string
  imageClass?: string
  imageSrc?: string
  displayName: string
  name: string
}

export const RPM_DEVICES: RPMDevice[] = [
  {
    id: '1',
    name: 'BALANCE Smart Scale',
    displayName: _('RPM.SCALE'),
    imageSrc: 'assets/img/balance-scale.png',
    imageClass: 'rpm-scale'
  },
  {
    id: '2',
    name: 'BEAT Blood Pressure Cuff',
    displayName: _('RPM.BP_CUFF'),
    imageSrc: 'assets/img/bloodpresscuff.png',
    imageClass: 'bp-cuff'
  },
  {
    id: '3',
    name: 'SCAN Smart Glucometer',
    displayName: _('RPM.GLUCOMETER'),
    imageSrc: 'assets/img/glucometer.png'
  },
  {
    id: '-1',
    name: 'None',
    displayName: _('RPM.NONE'),
    imageSrc: ''
  }
]
