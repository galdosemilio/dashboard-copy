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
  user: any
  @Input()
  showCallButton = false
  @Input()
  showRemoveButton = true

  @Output()
  remove: Subject<string> = new Subject<string>()

  currentAccount: CurrentAccount

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAccount = this.context.user
  }

  onGoToUserProfile(account): void {
    if (!this.allowUserLinking) {
      return
    }

    if (account.accountType) {
      this.router.navigate([this.context.getProfileRoute(account)])
    } else {
      this.account
        .getSingle(account.id)
        .then((acc: AccSingleResponse) => {
          this.router.navigate([this.context.getProfileRoute(acc)])
        })
        .catch((err) => {
          this.notifier.error(err)
        })
    }
  }

  onRemove(id: string): void {
    this.remove.next(id)
  }
}
