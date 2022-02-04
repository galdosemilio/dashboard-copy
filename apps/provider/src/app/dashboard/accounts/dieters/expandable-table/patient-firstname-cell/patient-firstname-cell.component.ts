import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { DieterListingItem } from '@app/shared'

interface LoadMoreArgs {
  name: string
  row: DieterListingItem
}

@Component({
  selector: 'app-patient-firstname-cell',
  templateUrl: './patient-firstname-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientFirstNameCell {
  @Input() row: DieterListingItem

  @Output() onLoadMore: EventEmitter<LoadMoreArgs> =
    new EventEmitter<LoadMoreArgs>()
  @Output() showDieter: EventEmitter<DieterListingItem> =
    new EventEmitter<DieterListingItem>()
  @Output() toggleRow: EventEmitter<DieterListingItem> =
    new EventEmitter<DieterListingItem>()
}
