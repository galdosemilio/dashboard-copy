import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LabelDialogs, LabelRoutes } from '@board/services'
import { LabelsDatabase } from '@coachcare/backend/data'
import { UpdatePackageRequest } from '@coachcare/sdk'
import { _, FormUtils } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-package-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class LabelFormComponent implements OnInit {
  form: FormGroup
  id: string | undefined
  item: any
  readonly = true
  colSpan = 2

  constructor(
    private builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService,
    private database: LabelsDatabase,
    private dialogs: LabelDialogs,
    public routes: LabelRoutes
  ) {}

  ngOnInit() {
    // setup the FormGroup
    this.createForm()

    // route parameters
    this.route.data.subscribe((data: any) => {
      if (data.lbl) {
        this.id = data.lbl.id
        this.item = data.lbl
        // fill the form
        this.form.patchValue(this.item)
      }

      this.readonly = data.readonly ? true : false
    })
  }

  createForm() {
    this.form = this.builder.group({
      title: [null, Validators.required],
      description: null,
      isActive: null
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.database
        .create(this.form.value)
        .then((res) => {
          this.notifier.success(_('NOTIFY.SUCCESS.LABEL_CREATED'))
          void this.router.navigate([this.routes.single(res.id)])
        })
        .catch((err) => this.notifier.error(err))
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const formValue = this.form.value
      if (this.id) {
        const req: UpdatePackageRequest = {
          id: this.id,
          title: formValue.title,
          description: formValue.description,
          isActive: true
        }
        this.database
          .update(req)
          .then(() => {
            this.notifier.success(_('NOTIFY.SUCCESS.LABEL_UPDATED'))
            void this.router.navigate([this.routes.single(this.id as string)])
          })
          .catch((err) => this.notifier.error(err))
      }
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  onCancel() {
    if (!this.id) {
      // create
      void this.router.navigate([this.routes.list()])
    } else {
      // update
      void this.router.navigate([this.routes.single(this.id as string)])
    }
  }

  onActivate() {
    this.dialogs
      .activatePrompt(this.item)
      .then(() => {
        this.item.isActive = true
        this.form.patchValue({ isActive: true })
        this.notifier.success(_('NOTIFY.SUCCESS.LABEL_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate() {
    this.dialogs
      .deactivatePrompt(this.item)
      .then(() => {
        this.item.isActive = false
        this.form.patchValue({ isActive: false })
        this.notifier.success(_('NOTIFY.SUCCESS.LABEL_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
