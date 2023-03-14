import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { filter, Subject } from 'rxjs'

import { AccountParams } from '@board/services'
import { EmailLogsDatabase, EmailLogsDataSource } from '@coachcare/backend/data'
import { AccountSingle, EmailIssue, NamedEntity } from '@coachcare/sdk'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-email-logs',
  templateUrl: './email-logs.component.html',
  providers: [EmailLogsDataSource]
})
export class EmailLogsComponent implements OnInit {
  public columns = ['updatedAt', 'from', 'to', 'subject', 'status', 'count']
  public sendgridList: NamedEntity[] = []
  public deliverabilityIssues: EmailIssue[] = []
  public sendgrid: string

  private account: AccountSingle
  private refresh$ = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private database: EmailLogsDatabase,
    private notifier: NotifierService,
    public source: EmailLogsDataSource
  ) {}

  ngOnInit() {
    this.source.addRequired(
      this.refresh$.pipe(
        filter(() => (this.account && this.sendgrid ? true : false))
      ),
      () => ({
        id: this.account.id,
        sendgrid: this.sendgrid
      })
    )

    this.route.data.subscribe((data: AccountParams) => {
      this.account = data.account
      this.refresh$.next()
    })

    this.refresh$
      .pipe(
        filter(() => !!this.account && !!this.sendgrid),
        untilDestroyed(this)
      )
      .subscribe(() =>
        this.resolveDeliverabilityIssues(this.account.id, this.sendgrid)
      )

    void this.resolveSendgridAccounts()
  }

  private async resolveSendgridAccounts(): Promise<void> {
    try {
      const res = await this.database.getSendgridAccounts()
      this.sendgridList = res.data
      this.sendgrid = this.sendgridList[0].id
      this.refresh$.next()
    } catch (err) {
      this.notifier.error(err)
    }
  }

  private async resolveDeliverabilityIssues(
    accountId: string,
    sendgrid: string
  ) {
    this.deliverabilityIssues = []

    if (!accountId || !sendgrid) {
      return
    }

    try {
      const res = await this.database.getEmailDeliverabilityIssues({
        id: accountId,
        sendgrid
      })

      this.deliverabilityIssues = res.data
    } catch (err) {
      this.notifier.error(err)
    }
  }

  public onChangeSendGrid() {
    this.refresh$.next()
  }

  public async onClearDeliverabilityIssues() {
    try {
      await this.database.clearEmailDeliverabilityIssues({
        id: this.account.id,
        sendgrid: this.sendgrid
      })

      this.refresh$.next()
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
