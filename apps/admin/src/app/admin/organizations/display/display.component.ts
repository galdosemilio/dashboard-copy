import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { OrganizationSingle } from '@coachcare/sdk'

import { OrganizationRoutes } from '@board/services'
import { OrganizationParams } from '@coachcare/common/services'

@Component({
  selector: 'ccr-organizations-display',
  templateUrl: './display.component.html'
})
export class OrganizationsDisplayComponent implements OnInit {
  id: string | undefined
  item: OrganizationSingle | undefined

  constructor(
    private route: ActivatedRoute,
    public routes: OrganizationRoutes
  ) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: OrganizationParams) => {
      this.item = data.org
      this.id = data.org ? data.org.id : undefined
      // TODO encapsulate the org info to resolve logo from preferences array
    })
  }
}
