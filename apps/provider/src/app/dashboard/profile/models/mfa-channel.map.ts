import { _ } from '@app/shared'
import { NamedEntity } from '@coachcare/sdk'

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

export const MFAChannels: { [key: string]: MFAChannel } = {
  ['1']: {
    code: 'auth',
    id: '1',
    name: 'Authenticator',
    displayName: _('PROFILE.MFA.AUTHENTICATOR'),
    steps: [
      _('PROFILE.MFA.AUTHENTICATOR_STEP1'),
      _('PROFILE.MFA.AUTHENTICATOR_STEP2'),
      _('PROFILE.MFA.AUTHENTICATOR_STEP3'),
      _('PROFILE.MFA.AUTHENTICATOR_STEP4')
    ]
  },
  ['2']: {
    code: 'sms',
    id: '2',
    name: 'SMS',
    displayName: _('PROFILE.MFA.SMS'),
    steps: []
  }
}
