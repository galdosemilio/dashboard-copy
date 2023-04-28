import { _ } from '@app/shared/utils'

export type CareServiceTag = 'rpm' | 'rtm' | 'pcm' | 'ccm' | 'bhi'

export interface CareServiceType {
  serviceType: {
    id: string // @TODO: validate list to match the entries on the server -- Zcyon
    name: string // translatable string
    tag: CareServiceTag
  }
  conflicts?: CareServiceTag[] // tags of conflicting care services
  deviceSetup?: boolean // enabling this means the user will have to choose a device
}

export const CARE_SERVICE_TYPES_MAP: Record<string, CareServiceType> = {
  rpm: {
    serviceType: {
      id: '1',
      name: _('CARE_SERVICES.RPM'),
      tag: 'rpm'
    },
    conflicts: ['rtm'],
    deviceSetup: true
  },
  rtm: {
    serviceType: {
      id: '3',
      name: _('CARE_SERVICES.RTM'),
      tag: 'rtm'
    },
    conflicts: ['rpm'],
    deviceSetup: true
  },
  ccm: {
    serviceType: {
      id: '2',
      name: _('CARE_SERVICES.CCM'),
      tag: 'ccm'
    },
    conflicts: ['pcm']
  },
  pcm: {
    serviceType: {
      id: '4',
      name: _('CARE_SERVICES.PCM'),
      tag: 'pcm'
    },
    conflicts: ['ccm']
  },
  bhi: {
    serviceType: {
      id: '5',
      name: _('CARE_SERVICES.BHI'),
      tag: 'bhi'
    }
  }
}
