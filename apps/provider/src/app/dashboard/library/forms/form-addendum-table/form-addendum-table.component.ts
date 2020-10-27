import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { ViewAddendumDialog } from '@app/dashboard/library/forms/dialogs';
import { FormSubmission } from '@app/dashboard/library/forms/models';
import {
  FormAddendumDatabase,
  FormAddendumDatasource,
} from '@app/dashboard/library/forms/services';
import { NotifierService } from '@app/service';
import { _, CcrPaginator, TextInputDialog } from '@app/shared';
import { FormAddendumSingle } from '@app/shared/selvera-api';

@Component({
  selector: 'app-library-form-addendum-table',
  templateUrl: './form-addendum-table.component.html',
})
export class FormAddendumTableComponent implements OnInit {
  @Input()
  submission: FormSubmission;

  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator;

  public columns: string[] = ['createdAt', 'content', 'actions'];
  public source: FormAddendumDatasource;

  constructor(
    private database: FormAddendumDatabase,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.source = new FormAddendumDatasource(
      this.database,
      this.notifier,
      this.paginator
    );
    this.source.addDefault({ submission: this.submission.id });
  }

  createFormAddendum(): void {
    this.dialog
      .open(TextInputDialog, {
        data: {
          title: _('LIBRARY.FORMS.ADD_ADDENDUM'),
          label: _('LIBRARY.FORMS.ADDENDUM_CONTENT'),
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog',
      })
      .afterClosed()
      .subscribe(async (text: string) => {
        if (text) {
          await this.source.createFormAddendum({
            submission: this.submission.id,
            content: text,
          });
          this.source.refresh();
        }
      });
  }

  async viewFormAddendum(addendum: FormAddendumSingle) {
    const fullAddendum: any = await this.source.getFormAddendum({
      id: addendum.id,
    });
    this.dialog.open(ViewAddendumDialog, {
      data: fullAddendum,
      width: '80vw',
      panelClass: 'ccr-full-dialog',
    });
  }
}
