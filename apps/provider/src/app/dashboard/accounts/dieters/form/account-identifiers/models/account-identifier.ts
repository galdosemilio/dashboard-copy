import { SelectedOrganization } from '@app/service'

export class AccountIdentifier {
  dirty?: boolean
  displayName?: string
  id?: string
  organization: SelectedOrganization
  name: string
  required?: boolean
  value?: string

  constructor(args: any, opts: any = {}) {
    this.dirty = args.dirty || false
    this.displayName = args.displayName || args.name
    this.id = args.id || ''
    this.organization = args.organization || opts.organization
    this.name = args.name || ''
    this.required = args.required || false
    this.value = args.value
  }
}
