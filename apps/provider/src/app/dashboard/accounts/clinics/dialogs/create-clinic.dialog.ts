import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/common/material'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _ } from '@app/shared/utils'
import { Organization } from '@coachcare/npm-api'

@Component({
  selector: 'app-clinics-create-dialog',
  templateUrl: './create-clinic.dialog.html',
  styleUrls: ['./create-clinic.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class CreateClinicDialog implements OnInit {
  public currentClinic: SelectedOrganization
  public form: FormGroup

  constructor(
    private context: ContextService,
    private dialogRef: MatDialogRef<CreateClinicDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organization: Organization
  ) {}

  public ngOnInit(): void {
    this.currentClinic = this.context.organization
    this.createForm()
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value
      const shortcode =
        formValue.name.toLowerCase().replace(/\W/gi, '_') + Date.now()
      await this.organization.create({ ...formValue, shortcode })
      this.notifier.success(_('NOTIFY.SUCCESS.CLINIC_CREATED'))
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      address: this.fb.group({
        city: [''],
        country: [''],
        postalCode: [''],
        state: [''],
        street: ['']
      }),
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required]
      }),
      isActive: [true],
      name: ['', Validators.required],
      parentOrganizationId: [this.context.organizationId],
      shortcode: ['']
    })
  }
}
