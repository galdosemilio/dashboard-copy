import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ConsumedFood } from '@app/dashboard/accounts/dieters/models/consumedFood/consumedFood'
import {
  FoodDataSource,
  FoodDayAmount
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { ViewImageDialog } from '@app/shared/dialogs'
import { FoodMeal } from '@coachcare/npm-api'

@Component({
  selector: 'app-dieter-journal-food-table',
  templateUrl: 'expandable-table.component.html',
  styleUrls: ['expandable-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FoodExpandableTable implements OnInit {
  @Input() columns = ['date', 'calories', 'protein', 'carb', 'fat']
  @Input() source: FoodDataSource

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialog: MatDialog,
    private food: FoodMeal,
    private notify: NotifierService
  ) {}

  ngOnInit() {
    this.cdr.detectChanges()
  }

  public onOpenThumbnail(row: ConsumedFood): void {
    if (!row.hasImageUrl) {
      return
    }

    this.dialog.open(ViewImageDialog, {
      data: { imageUrl: row.image.highres, title: row.name },
      width: '40vw'
    })
  }

  async toggleRow(row: FoodDayAmount) {
    if (row.isEmpty || row.level > 1) {
      return
    }

    row.isExpanded = !row.isExpanded

    switch (row.level) {
      case 0:
        row.types.forEach((t) => {
          t.isHidden = !row.isExpanded
          if (!row.isExpanded) {
            t.isExpanded = row.isExpanded
            t.meals.forEach((m) => (m.isHidden = !t.isExpanded))
          }
        })
        break

      case 1:
        row.meals.forEach((m) => (m.isHidden = !row.isExpanded || m.isEmpty))
        this.fetchAndLoadServings(row.meals.filter((m) => m.id))
        break
    }
  }

  private async fetchAndLoadServings(meals: ConsumedFood[]) {
    try {
      const promises = []
      meals.forEach((meal) => {
        if (meal.mealId) {
          promises.push(
            this.food.getSingle({
              id: meal.mealId,
              organization: this.context.organizationId
            })
          )
        }
      })

      const consumedMealResponses = await Promise.all(promises)
      consumedMealResponses.forEach((consumedMeal, index) => {
        meals[index].ingredients = consumedMeal.servings
        meals[index].hasMultipleIngredients = true

        if (
          !meals[index].hasImageUrl &&
          meals[index].ingredients.length === 1 &&
          (consumedMeal.servings[0].ingredient.image.thumbnail ||
            consumedMeal.servings[0].ingredient.image.highres)
        ) {
          meals[index].hasImageUrl = true
          meals[index].image = {
            thumbnail:
              consumedMeal.servings[0].ingredient.image.thumbnail ||
              meals[index].image.thumbnail,
            highres:
              consumedMeal.servings[0].ingredient.image.highres ||
              meals[index].image.highres
          }
        }
      })
    } catch (error) {
      this.notify.error(error)
    }
  }
}
