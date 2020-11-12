import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { AppDataSource } from '@coachcare/backend/model'
import { _ } from '@coachcare/backend/shared'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'ccr-datasource-overlay',
  templateUrl: './datasource-overlay.component.html',
  host: {
    '[class.ccr-loading]': 'source.isLoading',
    '[class.ccr-empty]': 'source.isEmpty',
    '[class.ccr-errors]': 'source.hasErrors()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasourceOverlayComponent implements OnInit, OnDestroy {
  @Input() source: AppDataSource<any, any, any>

  @Input() emptyMsg: string
  @Input() waitMsg = _('NOTIFY.SOURCE.DEFAULT_WAIT')
  @Input() delayMsg = _('NOTIFY.SOURCE.DEFAULT_DELAY')
  @Input() timeoutMsg = _('NOTIFY.SOURCE.DEFAULT_TIMEOUT')
  @Input() showErrors = true

  private onDestroy$ = new Subject<void>()

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // TODO add angular animations to fadeIn/fadeOut
    if (this.source) {
      // setup source messages
      if (this.emptyMsg) {
        this.source.showEmpty = this.emptyMsg
      }
      if (this.waitMsg) {
        this.source.waitMsg = this.waitMsg
      }
      if (this.delayMsg) {
        this.source.delayMsg = this.delayMsg
      }
      if (this.timeoutMsg) {
        this.source.timeoutMsg = this.timeoutMsg
      }

      // listen source changes
      this.source.change$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.cdr.markForCheck()
      })
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}
