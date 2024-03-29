import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { LabelsDataSource } from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'

@Component({
  selector: 'ccr-package-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [LabelsDataSource]
})
export class LabelsListComponent implements OnInit, OnDestroy {
  columns = ['id', 'title', 'actions']

  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  constructor(public source: LabelsDataSource) {}

  ngOnInit() {
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))

    this.source.addDefault({
      isActive: true
    })
  }

  ngOnDestroy() {
    this.source.unsetPaginator()
  }
}
