import { Component, EventEmitter, Input, Output } from '@angular/core'

type CcrSortDirection = 'asc' | 'desc'
export type CcrSort = {
  property: string
  dir: CcrSortDirection
}

@Component({
  selector: 'ccr-table-sort-header',
  templateUrl: './table-sort-header.component.html',
  styleUrls: ['./table-sort-header.component.scss']
})
export class CcrTableSortHeaderComponent {
  @Input() property: string

  @Output() onSortChange: EventEmitter<CcrSort> = new EventEmitter<CcrSort>()

  public direction: CcrSortDirection = null

  private directionFlow: CcrSortDirection[] = ['asc', 'desc', null]

  public onToggleHeader(): void {
    let currentDirectionIndex = this.directionFlow.findIndex(
      (direction) => direction === this.direction
    )

    ++currentDirectionIndex

    if (currentDirectionIndex >= this.directionFlow.length) {
      currentDirectionIndex = 0
    }

    this.direction = this.directionFlow[currentDirectionIndex]

    this.onSortChange.emit({
      property: this.property,
      dir: this.direction
    })
  }
}
