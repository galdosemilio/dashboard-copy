import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { LogsDataSource } from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { PaginatorComponent } from '@coachcare/common/components'

@Component({
  selector: 'ccr-userlogs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [LogsDataSource]
})
export class LogsListComponent implements OnInit, OnDestroy {
  columns = ['id', 'appName', 'uri', 'createdAt']
  accountId: string

  @ViewChild(PaginatorComponent, { static: true })
  paginator: PaginatorComponent

  constructor(private route: ActivatedRoute, public source: LogsDataSource) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.accountId = params['id']
    })

    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))
    this.source.addDefault({
      account: this.accountId
    })
  }

  ngOnDestroy() {
    this.source.unsetPaginator()
  }
}
