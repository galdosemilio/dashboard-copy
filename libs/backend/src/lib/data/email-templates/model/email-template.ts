export interface EmailTemplateOpts {
  organizationId: string
}

export class EmailTemplate {
  public category: string
  public html: string
  public id: string
  public isInherited?: boolean
  public locale: string
  public operation: string
  public organization: string
  public subject: string
  public text: string

  constructor(args: any, opts: EmailTemplateOpts = { organizationId: '' }) {
    this.category = args.category
    this.html = args.html
    this.id = args.id
    this.isInherited = args.organization !== opts.organizationId
    this.locale = args.locale
    this.operation = args.operation
    this.organization = args.organization
    this.subject = args.subject
    this.text = args.text
  }
}
