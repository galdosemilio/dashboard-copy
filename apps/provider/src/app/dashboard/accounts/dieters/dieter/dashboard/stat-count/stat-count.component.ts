import { Component, Input } from '@angular/core'
import { DataPointSummary } from '../summary-boxes/model/data-point-summary'

@Component({
  selector: 'ccr-stat-count',
  templateUrl: './stat-count.component.html',
  styleUrls: ['./stat-count.component.scss']
})
export class StatCountComponent {
  @Input()
  title: string

  @Input()
  record: DataPointSummary
}
