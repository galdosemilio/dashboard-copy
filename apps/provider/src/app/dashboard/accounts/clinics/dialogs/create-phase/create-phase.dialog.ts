import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { Package } from '@app/shared/components/package-table'
import { NamedEntity, Package as SelveraPackageService } from '@coachcare/sdk'
import { _ } from '@app/shared/utils'

@Component({
  selector: 'app-clinics-create-phase-dialog',
  templateUrl: './create-phase.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class CreatePhaseDialog implements OnInit {
  public clinic: NamedEntity
  public form: FormGroup
  public phases: Package[] = []

  constructor(
    private context: ContextService,
    private dialogRef: MatDialogRef<CreatePhaseDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private packageService: SelveraPackageService
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.clinic = this.context.clinic
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value

      await this.packageService.create({
        title: formValue.title,
        description: formValue.description || undefined,
        organization: this.clinic.id
      } as any)

      this.notifier.success(_('NOTIFY.SUCCESS.PHASE_CREATED'))
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: []
    })
  }
}
