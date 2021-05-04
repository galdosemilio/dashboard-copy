import { Component, Input } from '@angular/core'
import { MatPaginator } from '@coachcare/material'

@Component({
  selector: 'ccr-paginator',
  templateUrl: './paginator.component.html'
})
export class CcrPaginatorComponent extends MatPaginator {
  @Input() inverse = false
  @Input() disabled = false
}
