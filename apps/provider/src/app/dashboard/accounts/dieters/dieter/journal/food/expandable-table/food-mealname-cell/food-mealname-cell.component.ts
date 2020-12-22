import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FoodDayAmount } from '@app/dashboard/accounts/dieters/services'

@Component({
  selector: 'app-dieter-food-mealname-cell',
  templateUrl: './food-mealname-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodMealNameCell {
  @Input() row: any
}
