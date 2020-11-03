import { FormQuestionSingle, FormRef, FormSectionSingle } from '@app/shared/selvera-api';
import { FormQuestion } from './question.model';

export class FormSection implements FormSectionSingle {
  id: string;
  title: string;
  sortOrder: number;
  created?: boolean;
  deleted?: boolean;
  edited?: boolean;
  inServer?: boolean;
  questions?: FormQuestion[];
  form?: FormRef;
  description?: string;
  selected?: boolean;
  isMoved?: boolean;

  constructor(args: any, opts: any = {}) {
    this.id = args.id || '';
    this.title = args.title || '';
    this.sortOrder = args.sortOrder;
    this.created = args.created;
    this.deleted = args.deleted;
    this.edited = args.edited;
    this.inServer = opts.inServer;
    this.questions = args.questions
      ? args.questions.map(
          (q: FormQuestionSingle) =>
            new FormQuestion(q, { ...opts, section: { id: this.id } })
        )
      : [];
    this.form = opts.form || {};
    this.description = args.description || '';
    this.isMoved = args.isMoved || false;
  }
}
