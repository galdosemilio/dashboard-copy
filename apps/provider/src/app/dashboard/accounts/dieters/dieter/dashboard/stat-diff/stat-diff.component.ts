import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core'

@Component({
  selector: 'ccr-stat-diff',
  templateUrl: './stat-diff.component.html',
  styleUrls: ['./stat-diff.component.scss']
})
export class StatDiffComponent implements OnChanges, OnInit {
  @Input()
  isEditable: boolean

  @Input()
  title: string

  // TODO convert to numeric on set
  @Input()
  starting: string
  @Input()
  startingPercent: string
  @Input()
  current: string
  @Input()
  currentPercent: string
  @Input()
  startingTimestamp?: string
  @Input()
  currentTimestamp?: string

  @Output()
  edit = new EventEmitter<void>()

  public startingLessThanCurrent: boolean
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const starting = parseFloat(this.starting)
    const current = parseFloat(this.current)
    this.startingLessThanCurrent =
      starting < current ? true : starting > current ? false : null
  }

  onClick() {
    if (this.isEditable) {
      this.edit.emit()
    }
  }
}
