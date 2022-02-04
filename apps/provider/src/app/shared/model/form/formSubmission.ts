import { SelectedOrganization } from '@app/service'
import {
  AccSingleResponse,
  Entity,
  FormAnswer,
  FormRefNamed,
  FormSubmissionSegment
} from '@coachcare/sdk'

export class FormSubmission implements Partial<FormSubmissionSegment> {
  public answers: FormAnswer[]
  public canRemoveSubmission: boolean
  public id: string
  public form: FormRefNamed
  public account: Entity
  public organization: SelectedOrganization
  public submittedBy: AccSingleResponse
  public createdAt: string

  constructor(args: any) {
    this.id = args.id
    this.form = args.form
    this.account = args.account
    this.submittedBy = args.submittedBy
    this.createdAt = args.createdAt
    this.canRemoveSubmission = args.isAdmin
    this.answers = args.answers || []
    this.organization = args.organization
  }
}
