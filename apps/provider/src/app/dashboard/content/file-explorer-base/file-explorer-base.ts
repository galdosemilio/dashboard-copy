import {
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  FileExplorerBaseOptions,
  FileExplorerEvents
} from '@app/dashboard/content/models'
import { FileExplorerDatasource } from '@app/dashboard/content/services'
import { Subscription } from 'rxjs'

@Directive()
export class FileExplorerBase implements OnDestroy, OnInit {
  @Input()
  events: FileExplorerEvents
  @Input()
  source?: FileExplorerDatasource
  @Input()
  options?: FileExplorerBaseOptions = {
    enableDrag: true,
    enableDrop: true
  }

  public currentPage = 0

  protected onLoadMore: EventEmitter<void> = new EventEmitter<void>()
  protected subscriptions: { [name: string]: Subscription } = {}

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach((prop: string) => {
      if (this.subscriptions[prop]) {
        this.subscriptions[prop].unsubscribe()
      }
    })

    if (this.source) {
      this.source.unregister('offset')
    }
  }

  ngOnInit() {
    if (this.source) {
      this.source.register('offset', false, this.onLoadMore, () => ({
        offset: this.currentPage * this.source.pageSize
      }))
    }
  }

  loadMore() {
    ++this.currentPage
    this.onLoadMore.emit()
    this.source.refresh()
  }
}
