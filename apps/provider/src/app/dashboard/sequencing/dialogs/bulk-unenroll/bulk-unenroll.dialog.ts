import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { OrganizationEntity } from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import {
  OrganizationProvider,
  Sequence as SelveraSequenceService
} from '@coachcare/sdk'
import { Sequence } from '../../models'

type BulkUnenrollDialogState = 'form' | 'processing'

interface BulkUnenrollDialogProps {
  sequence: Sequence
}

@Component({
  selector: 'sequencing-bulk-unenroll-dialog',
  templateUrl: './bulk-unenroll.dialog.html',
  styleUrls: ['./bulk-unenroll.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class BulkUnenrollDialog implements OnInit {
  public bulkUnenrollProgress: number
  public currentOrg: OrganizationEntity
  public form: FormGroup
  public orgChildren: OrganizationEntity[] = []
  public selectedOrg: OrganizationEntity
  public state: BulkUnenrollDialogState = 'form'

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data: BulkUnenrollDialogProps,
    private dialog: MatDialogRef<BulkUnenrollDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organization: OrganizationProvider,
    private sequence: SelveraSequenceService
  ) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public async onBulkUnenroll(): Promise<void> {
    try {
      this.lockDialog()
      let completedOrgs = 0
      const orgAmount = this.orgChildren.length + 1
      const orgChildren = this.orgChildren.slice()

      this.currentOrg = this.selectedOrg
      this.state = 'processing'

      await this.sequence.createInactiveBulkOrganizationSeqEnrollments({
        organization: this.currentOrg.id,
        sequence: this.data.sequence.id
      } as any)

      this.bulkUnenrollProgress = this.calculateProgress(
        ++completedOrgs,
        orgAmount
      )
      this.cdr.detectChanges()

      while (orgChildren.length) {
        this.currentOrg = orgChildren.shift()
        await this.sequence.createInactiveBulkOrganizationSeqEnrollments({
          organization: this.currentOrg.id,
          sequence: this.data.sequence.id
        } as any)
        this.bulkUnenrollProgress = this.calculateProgress(
          ++completedOrgs,
          orgAmount
        )
        this.cdr.detectChanges()
      }

      this.notifier.success(_('NOTIFY.SUCCESS.SEQUENCING_BULK_UNENROLL'))
      this.dialog.close()
    } catch (error) {
      this.notifier.error(_('NOTIFY.ERROR.SEQUENCING_NO_UNENROLLED_ERROR'))
      this.state = 'form'
    } finally {
      this.unlockDialog()
    }
  }

  public onOrgSelect($event: OrganizationEntity): void {
    if (typeof $event === 'object' && $event.id) {
      this.selectedOrg = $event
      void this.fetchOrgChildren(this.selectedOrg.id)
      this.form.controls.organization.setValue(this.selectedOrg.id)
    }
  }

  private calculateProgress(completed: number, total: number): number {
    return Math.round((completed / total) * 100)
  }

  private createForm(): void {
    this.form = this.fb.group({
      organization: ['', [Validators.required]]
    })
  }

  private async fetchOrgChildren(orgId: string): Promise<void> {
    try {
      const response = await this.organization.getDescendants({
        organization: orgId,
        offset: 0,
        limit: 'all'
      })
      this.orgChildren = response.data
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private lockDialog(): void {
    this.dialog.disableClose = true
  }

  private unlockDialog(): void {
    this.dialog.disableClose = false
  }
}
