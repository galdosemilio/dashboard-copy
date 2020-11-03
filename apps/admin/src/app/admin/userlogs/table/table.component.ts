import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AppDataSource } from '@coachcare/backend/model'
import * as moment from 'moment'

@Component({
  selector: 'ccr-userlogs-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsTableComponent {
  @Input() columns = []
  @Input() source: AppDataSource<any, any, any>

  constructor() {}

  formatDate(date: string) {
    return moment(date).format('llll')
  }
}
