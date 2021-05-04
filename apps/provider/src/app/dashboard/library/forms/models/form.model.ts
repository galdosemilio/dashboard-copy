import { FormSectionSingle, OrgRef } from '@coachcare/sdk'
import { FormSection } from './section.model'

export class Form {
  public allowAddendum: boolean
  public id: string
  public isActive: boolean
  public isForeign: boolean
  public maximumSubmissions: number
  public removableSubmissions: boolean
  public name: string
  public organization: OrgRef
  public sections?: FormSection[]
  public isAdmin?: boolean

  constructor(args: any, opts: any = {}) {
    this.id = args.id
    this.name = args.name
    this.organization = args.organization
    this.isActive = args.isActive
    this.isForeign = opts.organization
      ? opts.organization.id !== args.organization.id
      : false
    this.maximumSubmissions = args.maximumSubmissions
    this.allowAddendum = args.allowAddendum
    this.removableSubmissions = args.removableSubmissions || false
    this.sections = args.sections
      ? args.sections.map(
          (s: FormSectionSingle) =>
            new FormSection(s, { ...opts, form: { id: this.id } })
        )
      : []
    this.isAdmin = args.isAdmin
  }
}
