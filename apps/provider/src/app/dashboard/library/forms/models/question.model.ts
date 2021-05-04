import { SafeResourceUrl } from '@angular/platform-browser'
import { Entity, FormAnswer, FormQuestionSingle } from '@coachcare/sdk'
import { FormQuestionType } from './question-type.interface'
import { QUESTION_TYPE_MAP } from './question-type.map'

export class FormQuestion implements FormQuestionSingle {
  public allowedValues?: string[]
  public answer?: FormAnswer
  public created?: boolean
  public deleted?: boolean
  public description?: string
  public edited?: boolean
  public id: string
  public inServer?: boolean
  public isRequired: boolean
  public questionType: FormQuestionType
  public title: string
  public section: Entity
  public sortOrder: number
  public isMoved?: boolean
  public index?: number
  public recreated?: boolean
  public url: SafeResourceUrl

  constructor(args: any, opts: any = {}) {
    this.id = args.id || ''
    this.section = args.section || opts.section
    this.questionType = args.questionType
      ? QUESTION_TYPE_MAP[args.questionType.id]
      : QUESTION_TYPE_MAP[1]
    this.title = args.title || ''
    this.description = args.description || ''
    this.sortOrder = args.sortOrder
    this.isRequired = args.isRequired || false
    this.allowedValues =
      args.allowedValues && args.allowedValues.length
        ? args.allowedValues
        : undefined
    this.created = args.created || false
    this.inServer = opts.inServer
    this.answer = args.answer
    this.isMoved = args.isMoved || false
    this.edited = args.edited || false
  }
}
