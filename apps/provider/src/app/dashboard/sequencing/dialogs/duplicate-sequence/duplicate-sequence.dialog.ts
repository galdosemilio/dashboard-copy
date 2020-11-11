import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { OrganizationEntity, OrganizationPermission } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { Sequence as CcrSequenceService } from '@coachcare/npm-api'
import { Sequence } from '../../models'

export interface DuplicateSequenceDialogProps {
  sequence: Sequence
}

interface DuplicateSequenceDialogFormProps {
  organization: string
  sequence: Sequence
}

@Component({
  selector: 'sequencing-duplicate-sequence-dialog',
  templateUrl: './duplicate-sequence.dialog.html',
  styleUrls: ['./duplicate-sequence.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class DuplicateSequenceDialog implements OnInit {
  public currentSequence: Sequence
  public form: FormGroup
  public initialOrg: OrganizationEntity
  public isLoading = false
  public noAdminOrg = false
  public requiredPermissions: Partial<OrganizationPermission> = { admin: true }

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: DuplicateSequenceDialogProps,
    private dialogRef: MatDialogRef<DuplicateSequenceDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private sequence: CcrSequenceService
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.readData()
    this.initialOrg = this.context.organization
  }

  public async onDuplicate(): Promise<void> {
    try {
      this.isLoading = true
      const formValue: DuplicateSequenceDialogFormProps = this.form.value
      this.form.disable()

      this.sequence.createSequenceClone({
        id: formValue.sequence.id,
        organization: formValue.organization,
        createdBy: this.context.user.id
      })

      this.dialogRef.close(true)
      this.notifier.success(_('NOTIFY.SUCCESS.SEQUENCE_SAVED'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.form.enable()
      this.isLoading = false
    }
  }

  public async onSelectOrg(organization: OrganizationEntity): Promise<void> {
    try {
      if (organization && organization.id) {
        this.noAdminOrg = !(await this.context.orgHasPerm(
          organization.id,
          'admin',
          false
        ))
        this.form.patchValue({ organization: organization.id })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      organization: ['', Validators.required],
      sequence: ['', Validators.required]
    })
  }

  private async readData(): Promise<void> {
    try {
      this.currentSequence = this.data.sequence

      const response = await this.sequence.getSequence({
        id: this.data.sequence.id,
        organization: this.data.sequence.organization.id,
        status: 'active',
        full: true
      })

      const sequence = new Sequence(response, {
        inServer: false,
        new: true,
        edited: true
      })

      this.form.patchValue({ name: sequence.name, sequence: sequence })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
