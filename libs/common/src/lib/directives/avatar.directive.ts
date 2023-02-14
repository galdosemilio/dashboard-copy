import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Input,
  OnInit
} from '@angular/core'
import { AccountProvider } from '@coachcare/sdk'
import { EventsService } from '../services'
import { sleep } from '../shared'

@Directive({
  selector: 'img[ccrAvatar]',
  exportAs: 'ccrAvatar',
  host: {
    '(error)': 'onError()'
  }
})
export class CcrAvatarDirective implements OnInit {
  accountId: string

  @HostBinding('src')
  src: string

  @Input()
  set ccrAvatar(accountId) {
    this.accountId = accountId
    void this.refresh()
  }

  @Input()
  default = '/assets/avatar.png'

  constructor(
    private cdr: ChangeDetectorRef,
    private bus: EventsService,
    private account: AccountProvider
  ) {}

  public ngOnInit(): void {
    this.bus.register('user.avatar', (id: string) => {
      if (id === this.accountId) {
        void this.refresh()
      }
    })
  }

  private onError() {
    this.src = this.default
  }

  private async refresh(): Promise<void> {
    try {
      // we wait for a while after uploading it
      await sleep(2000)

      if (!this.accountId) {
        this.setSrc(this.default)
        return
      }

      const avatar = await this.account.getAvatar(this.accountId)

      this.setSrc(avatar?.url ?? this.default)
    } catch (error) {
      this.onError()
    }
  }

  private setSrc(src: string): void {
    this.src = src
    this.cdr.detectChanges()
  }
}
