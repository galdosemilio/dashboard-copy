import { NamedEntity } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'

export const MFAChannels: { [key: string]: MFAChannel } = {
  ['1']: {
    code: 'auth',
    id: '1',
    name: 'Authenticator',
    displayName: _('MFA.AUTHENTICATOR'),
    steps: [
      _('MFA.AUTHENTICATOR_STEP1'),
      _('MFA.AUTHENTICATOR_STEP2'),
      _('MFA.AUTHENTICATOR_STEP3'),
      _('MFA.AUTHENTICATOR_STEP4')
    ]
  },
  ['2']: {
    code: 'sms',
    id: '2',
    name: 'SMS',
    displayName: _('MFA.SMS'),
    steps: []
  }
}

export class MFAChannel implements NamedEntity {
  code: 'auth' | 'sms' | 'unknown' | 'disabled'
  displayName: string
  id: string
  name: string
  steps: string[]

  constructor(args: any) {
    const mappedChannel = MFAChannels[args.id]
    if (mappedChannel) {
      this.code = mappedChannel.code
      this.displayName = mappedChannel.displayName
      this.id = args.id
      this.name = args.name
      this.steps = mappedChannel.steps.slice()
    } else {
      this.code = args.code || 'unknown'
      this.displayName = args.displayName || args.name
      this.id = args.id
      this.name = args.name
      this.steps = []
    }
  }
}
