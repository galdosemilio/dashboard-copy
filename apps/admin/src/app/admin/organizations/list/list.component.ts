import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { OrganizationsDataSource } from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { PaginatorComponent } from '@coachcare/common/components'

@Component({
  selector: 'ccr-organizations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [OrganizationsDataSource]
})
export class OrganizationsListComponent implements OnInit, OnDestroy {
  columns = [
    'id',
    'name',
    'androidAppId',
    'iosAppId',
    'parentOrg',
    'plan',
    'actions'
  ]

  @ViewChild(PaginatorComponent, { static: true })
  paginator: PaginatorComponent

  constructor(public source: OrganizationsDataSource) {}

  ngOnInit() {
    // setup admin listing
    this.source.addDefault({
      isAdmin: true
    })

    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))
  }

  ngOnDestroy() {
    this.source.unsetPaginator()
  }
}
