import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FoodDayAmount } from '@app/dashboard/accounts/dieters/services'

@Component({
  selector: 'app-dieter-food-fat-cell',
  templateUrl: './food-fat-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodFatCell {
  @Input() row: FoodDayAmount
}
