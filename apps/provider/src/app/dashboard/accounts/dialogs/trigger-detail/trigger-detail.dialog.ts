import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatPaginator } from '@coachcare/common/material';
import { Sequence } from '@app/dashboard/sequencing/models';
import { ContextService } from '@app/service';
import { GetAllSeqEnrollmentsResponse } from '@app/shared/selvera-api';
import {
  TriggerHistoryDatabase,
  TriggerHistoryDataSource,
} from '../../dieters/dieter/settings/services/trigger-history';

interface TriggerDetailDialogProps {
  enrollment: GetAllSeqEnrollmentsResponse;
  sequence: Sequence;
}

@Component({
  selector: 'app-trigger-detail-dialog',
  templateUrl: './trigger-detail.dialog.html',
  host: { class: 'ccr-dialog' },
})
export class TriggerDetailDialog implements OnDestroy, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator;

  columns: string[] = ['type', 'createdAt', 'createdAtHour', 'content'];
  source: TriggerHistoryDataSource;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TriggerDetailDialogProps,
    private context: ContextService,
    private database: TriggerHistoryDatabase
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createSource();
    this.resolveData();
  }

  private createSource(): void {
    this.source = new TriggerHistoryDataSource(this.database, this.paginator);

    this.source.addDefault({
      account: this.context.accountId,
      organization: this.context.organizationId,
    });
  }

  private resolveData(): void {
    if (this.data.sequence) {
      this.source.addDefault({ sequence: this.data.sequence.id });
    }

    if (this.data.enrollment) {
      this.source.addDefault({
        account: this.data.enrollment.account.id,
        sequence: this.data.enrollment.sequence.id,
      });
    }
  }
}
