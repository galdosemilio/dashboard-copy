import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FoodDayAmount } from '@app/dashboard/accounts/dieters/services'

@Component({
  selector: 'app-dieter-food-carb-cell',
  templateUrl: './food-carb-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodCarbCell {
  @Input() row: FoodDayAmount
}
