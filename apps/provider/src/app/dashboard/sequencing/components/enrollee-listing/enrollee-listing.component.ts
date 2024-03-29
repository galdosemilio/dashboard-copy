import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog } from '@coachcare/material'
import { Router } from '@angular/router'
import { TriggerDetailDialog } from '@app/dashboard/accounts/dialogs'
import { ContextService } from '@app/service'
import { _, AddRecipientDialog, PromptDialog } from '@app/shared'
import { GetAllSeqEnrollmentsResponse } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Sequence as SelveraSequenceService } from '@coachcare/sdk'
import { BulkUnenrollDialog } from '../../dialogs'
import { Sequence } from '../../models'
import { EnrolleesDatabase, EnrolleesDataSource } from '../../services'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'sequencing-enrollee-listing',
  templateUrl: 'enrollee-listing.component.html',
  styleUrls: ['./enrollee-listing.component.scss']
})
export class EnrolleeListingComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true }) paginator

  @Input() sequence: Sequence
  source: EnrolleesDataSource

  columns: string[] = ['name', 'createdAt', 'isActive', 'actions']

  constructor(
    private context: ContextService,
    private database: EnrolleesDatabase,
    private dialog: MatDialog,
    private router: Router,
    private seq: SelveraSequenceService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.source = new EnrolleesDataSource(this.database, this.paginator)
    this.source.addDefault({
      organization: this.context.organizationId,
      sequence: this.sequence.id
    })
  }

  onAddRecipients(): void {
    if (!this.sequence) {
      return
    }

    this.dialog
      .open(AddRecipientDialog, {
        data: {
          allowBulkEnrollment: true,
          sequence: this.sequence,
          readonly: true
        },
        disableClose: true,
        panelClass: 'ccr-full-dialog',
        width: '80vw'
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.paginator.firstPage()
        this.source.refresh()
      })
  }

  onBulkRemoveRecipients(): void {
    this.dialog
      .open(BulkUnenrollDialog, {
        data: { sequence: this.sequence },
        panelClass: 'ccr-full-dialog',
        width: '80vw'
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.paginator.firstPage()
        this.source.refresh()
      })
  }

  onDeleteEnrollment(enrollment): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('SEQUENCING.DELETE_ENROLLMENT_TITLE'),
          content: _('SEQUENCING.DELETE_ENROLLMENT_CONTENT')
        }
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((confirm) => confirm)
      )
      .subscribe(async () => {
        await this.seq.createInactiveSeqEnrollment({
          account: enrollment.account.id,
          createdBy: this.context.user.id,
          sequence: enrollment.sequence.id
        })
        this.paginator.firstPage()
        this.source.refresh()
      })
  }

  onGoToPatientProfile(enrollment): void {
    void this.router.navigate([
      '/accounts/patients/',
      enrollment.account.id,
      'dashboard'
    ])
  }

  onViewEnrollmentTriggers(enrollment: GetAllSeqEnrollmentsResponse): void {
    this.dialog.open(TriggerDetailDialog, {
      data: { enrollment: enrollment },
      panelClass: 'ccr-full-dialog',
      width: '80vw'
    })
  }
}
