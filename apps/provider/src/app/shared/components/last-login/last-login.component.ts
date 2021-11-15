import { Component, Input, OnInit } from '@angular/core'
import { NotifierService } from '@app/service'
import { AccountProvider, LoginHistoryItem } from '@coachcare/sdk'

@Component({
  selector: 'ccr-last-login',
  templateUrl: './last-login.component.html',
  styleUrls: ['./last-login.component.scss']
})
export class CcrLastLoginComponent implements OnInit {
  @Input() accountId: string
  @Input() routerLinkArgs: Array<string | Object>

  public lastLoginEntry?: LoginHistoryItem

  constructor(
    private account: AccountProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    void this.resolveLastLoginTime()
  }

  private async resolveLastLoginTime(): Promise<void> {
    try {
      const response = await this.account.getLoginHistory({
        account: this.accountId,
        limit: 1
      })

      const lastEntry: LoginHistoryItem = response.data.pop()

      if (!lastEntry) {
        this.lastLoginEntry = null
        return
      }

      this.lastLoginEntry = lastEntry
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
