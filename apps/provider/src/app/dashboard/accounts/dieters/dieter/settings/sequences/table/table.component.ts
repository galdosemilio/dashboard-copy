import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatPaginator } from '@coachcare/common/material';
import { TriggerDetailDialog } from '@app/dashboard/accounts/dialogs';
import { ContextService } from '@app/service';
import { _, PromptDialog } from '@app/shared';
import { GetAllSeqEnrollmentsResponse } from '@app/shared/selvera-api';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Sequence } from 'selvera-api';
import { SequenceEnrollmentDataSource } from '../../services';

@Component({
  selector: 'app-dieter-sequences-table',
  templateUrl: './table.component.html',
})
export class DieterSequencesTableComponent implements OnDestroy {
  @Input()
  paginator: MatPaginator;
  @Input()
  source: SequenceEnrollmentDataSource;

  columns: string[] = ['name', 'startDate', 'status', 'actions'];

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private sequence: Sequence
  ) {}

  ngOnDestroy(): void {}

  onDeleteEnrollment(enrollment): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('SEQUENCING.DELETE_ENROLLMENT_TITLE'),
          content: _('SEQUENCING.DELETE_ENROLLMENT_CONTENT'),
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (confirm) => {
        if (confirm) {
          await this.sequence.createInactiveSeqEnrollment({
            account: this.context.accountId,
            createdBy: this.context.user.id,
            sequence: enrollment.sequence.id,
          });
          this.paginator.firstPage();
          this.source.refresh();
        }
      });
  }

  onSelectEnrollment(enrollment): void {
    console.log({ enrollment });
  }

  onViewEnrollmentTriggers(enrollment: GetAllSeqEnrollmentsResponse): void {
    this.dialog.open(TriggerDetailDialog, {
      data: { sequence: enrollment.sequence },
      panelClass: 'ccr-full-dialog',
      width: '80vw',
    });
  }
}
