import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Input,
  OnInit
} from '@angular/core'
import { AccountAvatar } from '@coachcare/sdk'
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
    this.refresh()
  }

  @Input()
  default = '/assets/avatar.png'

  constructor(
    private cdr: ChangeDetectorRef,
    private bus: EventsService,
    private accountAvatar: AccountAvatar
  ) {}

  public ngOnInit(): void {
    this.bus.register('user.avatar', (id: string) => {
      if (id === this.accountId) {
        this.refresh()
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

      const newSrc =
        (this.accountId &&
          (
            await this.accountAvatar.get({
              id: this.accountId
            })
          ).url) ||
        this.default

      this.setSrc(`${newSrc}`)
    } catch (error) {
      this.onError()
    }
  }

  private setSrc(src: string): void {
    this.src = src
    this.cdr.detectChanges()
  }
}
