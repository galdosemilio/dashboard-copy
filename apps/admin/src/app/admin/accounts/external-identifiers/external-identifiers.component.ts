import { Component, Inject, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { filter, Subject } from 'rxjs'

import { AccountParams } from '@board/services'
import {
  ExternalIdentifiersDatabase,
  ExternalIdentifiersDataSource
} from '@coachcare/backend/data'
import { PromptDialog } from '@coachcare/common/dialogs/core'
import { AppEnvironment, APP_ENVIRONMENT, _ } from '@coachcare/common/shared'
import { AccountSingle, AddIdentifierRequest, Identifier } from '@coachcare/sdk'
import { NotifierService } from '@coachcare/common/services'
import { AddExternalIdentifierDialogComponent } from '../dialogs'

@Component({
  selector: 'ccr-external-identifiers',
  templateUrl: './external-identifiers.component.html',
  providers: [ExternalIdentifiersDataSource]
})
export class ExternalIdentifiersComponent implements OnInit {
  public columns = ['id', 'organization', 'name', 'value', 'actions']
  private account: AccountSingle
  private refresh$ = new Subject<void>()

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private database: ExternalIdentifiersDatabase,
    private notifier: NotifierService,
    public source: ExternalIdentifiersDataSource
  ) {}

  ngOnInit() {
    this.source.addDefault({
      organization: this.environment.defaultOrgId,
      strict: true
    })

    this.source.addOptional(this.refresh$, () => ({
      account: this.account.id
    }))

    this.route.data.subscribe((data: AccountParams) => {
      this.account = data.account
      this.refresh$.next()
    })
  }

  public onShowAddDialog() {
    this.dialog
      .open(AddExternalIdentifierDialogComponent, {
        data: {
          account: this.account
        }
      })
      .afterClosed()
      .pipe(filter((data) => data))
      .subscribe((data) => this.onCreate(data))
  }

  public onShowDeleteConfirm(identifier: Identifier): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.DELETE_EXTERNAL_IDENTIFIER'),
          content: _('GLOBAL.DELETE_EXTERNAL_IDENTIFIER_PROMPT'),
          yes: _('GLOBAL.DELETE'),
          no: _('GLOBAL.CANCEL')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.onDelete(identifier))
  }

  private async onCreate(data: AddIdentifierRequest) {
    try {
      await this.database.create(data)
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async onDelete(identifier: Identifier): Promise<void> {
    try {
      await this.database.delete({
        id: identifier.id,
        account: identifier.account.id
      })
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
