import { EventEmitter } from '@angular/core'
import { CcrDropEvent } from '@app/shared'
import { FormQuestion } from './question.model'

export class ManagerEvents {
  public addQuestion: EventEmitter<void>
  public moveQuestion: EventEmitter<CcrDropEvent>
  public moveQuestionIntoSection: EventEmitter<CcrDropEvent>
  public removeQuestion: EventEmitter<FormQuestion>
  public questionAdded: EventEmitter<FormQuestion>
  public questionRemoved: EventEmitter<FormQuestion>
  public questionSelected: EventEmitter<FormQuestion>
  public questionStaged: EventEmitter<void>
  public refreshQuestionIndexes: EventEmitter<void>

  constructor() {
    this.addQuestion = new EventEmitter<void>()
    this.moveQuestion = new EventEmitter<CcrDropEvent>()
    this.moveQuestionIntoSection = new EventEmitter<CcrDropEvent>()
    this.removeQuestion = new EventEmitter<FormQuestion>()
    this.questionAdded = new EventEmitter<FormQuestion>()
    this.questionRemoved = new EventEmitter<FormQuestion>()
    this.questionSelected = new EventEmitter<FormQuestion>()
    this.questionStaged = new EventEmitter<void>()
    this.refreshQuestionIndexes = new EventEmitter<void>()
  }
}
