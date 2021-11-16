import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Form } from '@app/dashboard/library/forms/models'
import { ContextService, NotifierService } from '@app/service'
import { BINDFORM_TOKEN } from '@app/shared'
import { Feedback } from '@coachcare/sdk'

@Component({
  selector: 'app-library-form-form',
  templateUrl: './form.form.component.html',
  styleUrls: ['./form.form.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormFormComponent)
    }
  ]
})
export class FormFormComponent implements OnInit {
  public readonly = false
  public removableSubmissionsStatus:
    | 'pending'
    | 'submitting'
    | 'submitted'
    | 'error' = 'pending'

  @Input()
  edit: boolean

  @Input()
  set content(f: Form) {
    if (f) {
      this.form.patchValue({
        name: f.name,
        allowAddendum: f.allowAddendum,
        maximumSubmissions: f.maximumSubmissions === 1 ? true : false,
        removableSubmissions: f.removableSubmissions || false
      })

      if (this.edit) {
        const controls = this.form.controls
        controls.maximumSubmissions.disable()
        controls.allowAddendum.disable()
        controls.removableSubmissions.disable()
      }

      this._form = f
    } else {
      this.form.reset()
    }
  }

  get content(): Form {
    return this._form
  }

  public form: FormGroup

  private _form: Form

  constructor(
    private context: ContextService,
    private feedback: Feedback,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: ActivatedRoute
  ) {
    this.createForm()
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.readonly = data.readonly
    })
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      allowAddendum: [
        { value: undefined, disabled: this.edit },
        Validators.required
      ],
      maximumSubmissions: [
        { value: undefined, disabled: this.edit },
        Validators.required
      ],
      removableSubmissions: [
        { value: undefined, disabled: this.edit },
        Validators.required
      ]
    })
  }

  public async requestChangeRemovableSubmissions(): Promise<void> {
    try {
      this.removableSubmissionsStatus = 'submitting'

      await this.feedback.sendFeedback({
        title: 'Request to modify form Removable Submissions setting',
        description: `This request was automatically generated. ${
          this.context.user.firstName
        } ${this.context.user.lastName} (ID: ${
          this.context.user.id
        }) requests that the Removable Submissions setting for form “${
          this._form.name
        }” (ID: ${this._form.id}) be changed from “${
          this._form.removableSubmissions ? 'Yes' : 'No'
        }” to “${
          !this._form.removableSubmissions ? 'Yes' : 'No'
        }”. Support team, please make this adjustment and update this support ticket when the change is complete.`
      })

      this.removableSubmissionsStatus = 'submitted'
    } catch (error) {
      this.notifier.error(error)
      this.removableSubmissionsStatus = 'error'
    }
  }
}
