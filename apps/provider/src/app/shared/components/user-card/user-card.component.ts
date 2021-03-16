import { Component, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { ContextService, CurrentAccount, NotifierService } from '@app/service'
import { AccountProvider, AccSingleResponse } from '@coachcare/npm-api'
import { Subject } from 'rxjs'

@Component({
  selector: 'ccr-user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {
  @Input()
  allowUserLinking = false
  @Input()
  allowUserLinkingBlank = false
  @Input()
  user: any
  @Input()
  showCallButton = false
  @Input()
  showRemoveButton = true

  @Output()
  remove: Subject<string> = new Subject<string>()

  currentAccount: CurrentAccount
  isGoingToProfile = false

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAccount = this.context.user
  }

  async onGoToUserProfile(account, openNewTab = false): Promise<void> {
    if (!this.allowUserLinking) {
      return
    }

    if (this.isGoingToProfile) {
      // prevent to opening new tab twice when double click Icon.
      return
    }

    let route = []
    this.isGoingToProfile = true

    try {
      if (account.accountType) {
        route = [this.context.getProfileRoute(account)]
      } else {
        const acc: AccSingleResponse = await this.account.getSingle(account.id)
        route = [this.context.getProfileRoute(acc)]
      }
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isGoingToProfile = false
    }

    if (!route.length) {
      return
    }

    if (openNewTab) {
      const newRelativeUrl = this.router.createUrlTree(route)
      const baseUrl = window.location.href.replace(this.router.url, '')
      window.open(baseUrl + newRelativeUrl, '_blank')
    } else {
      this.router.navigate(route)
    }
  }

  onRemove(id: string): void {
    this.remove.next(id)
  }
}
