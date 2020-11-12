import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { AppDataSource } from '@coachcare/backend/model'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'ccr-table-overlay',
  templateUrl: './table-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableOverlayComponent implements OnInit, OnDestroy {
  @Input() source: AppDataSource<any, any, any>
  @Input() emptyMsg: string

  private onDestroy = new Subject<void>()

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.source) {
      // setup empty message
      if (this.emptyMsg) {
        this.source.showEmpty = this.emptyMsg
      }

      // listen source changes
      this.source.change$.pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.cdr.markForCheck()
      })
    }
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
