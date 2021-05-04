import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete'
import { NotifierService } from '@app/service'
import { sleep, _ } from '@app/shared/utils'
import {
  AccountProvider,
  AccountAccessData,
  GetListAccountRequest,
  GetListAccountResponse
} from '@coachcare/sdk'
import { fromEvent, of } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  sampleTime,
  takeUntil
} from 'rxjs/operators'

@Component({
  selector: 'app-participants-input',
  templateUrl: './participants-input.component.html',
  styleUrls: ['./participants-input.component.scss']
})
export class ScheduleParticipantsInputComponent implements OnInit {
  @Input() excludes: AccountAccessData[] = []

  @Output()
  onSelect: EventEmitter<AccountAccessData> = new EventEmitter<AccountAccessData>()

  @ViewChild('auto', { static: true }) autocomplete: MatAutocomplete
  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  public accounts: AccountAccessData[] = []
  public isLoading = false
  public searchCtrl: FormControl

  private PAGE_SIZE = 25
  private hasNextPage = false
  private pageIndex = 0

  constructor(
    private account: AccountProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createControl()
  }

  public async autocompleteScroll(): Promise<void> {
    await sleep(100)
    if (!this.autocomplete.panel) {
      return
    }

    fromEvent(this.autocomplete.panel.nativeElement, 'scroll')
      .pipe(
        takeUntil(this.trigger.panelClosingActions),
        sampleTime(300),
        mergeMap(() => of(this.calculatePoints()))
      )
      .subscribe((pos: any) => this.handleScroll(pos))
  }

  public onParticipantSelected(participant): void {
    this.onSelect.emit(participant)
  }

  private calculatePoints() {
    const el = this.autocomplete.panel.nativeElement
    return {
      height: el.offsetHeight,
      scrolled: el.scrollTop,
      total: el.scrollHeight
    }
  }

  private createControl(): void {
    this.searchCtrl = new FormControl('')
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.pageIndex = 0

        if (this.autocomplete.panel) {
          this.autocomplete.panel.nativeElement.scrollTop = 0
        }

        if (query) {
          this.searchAccounts(query)
        } else {
          this.trigger.closePanel()
        }
      })
  }

  private async fetchAccounts(
    request: GetListAccountRequest
  ): Promise<GetListAccountResponse> {
    try {
      this.isLoading = true
      const res = await this.account.getList({
        ...request,
        limit: this.PAGE_SIZE
      })

      this.hasNextPage = !!res.pagination.next

      return res
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async handleScroll(position) {
    if (position.height + position.scrolled >= position.total - 50) {
      if (!this.isLoading && this.hasNextPage) {
        ++this.pageIndex
        const res = await this.fetchAccounts({
          query: this.searchCtrl.value,
          offset: this.pageIndex * this.PAGE_SIZE
        })
        const filteredAccounts = res.data.filter(
          (a) => !this.excludes.some((sa) => sa.id === a.id)
        )
        this.accounts = [...this.accounts, ...filteredAccounts]
      }
    }
  }

  private async searchAccounts(query: string): Promise<void> {
    try {
      this.accounts = (await this.fetchAccounts({ query })).data.filter(
        (a) => !this.excludes.some((sa) => sa.id === a.id)
      )

      if (this.accounts.length > 0) {
        this.trigger.openPanel()
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
