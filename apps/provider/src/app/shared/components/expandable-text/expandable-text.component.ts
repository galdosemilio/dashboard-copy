import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-expandable-text',
  templateUrl: './expandable-text.component.html',
  styleUrls: ['./expandable-text.component.scss']
})
export class ExpandableTextComponent {
  @Input() text: string

  @Input() maxLength = 30

  @Input() collapseLength = 25

  public isExpanded = false

  get renderedText() {
    if (!this.text) {
      return ''
    }

    if (this.isExpanded || this.text.length <= this.maxLength) {
      return this.text
    }

    return this.text.slice(0, this.collapseLength) + '...'
  }

  public toggleExpand() {
    this.isExpanded = !this.isExpanded
  }
}
