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
import { FoodMeal } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { resolveConfig } from '@app/config/section'

enum MOOD_COLORS {
  SAD = '#F16961',
  MEH = '#F7AC41',
  OKAY = '#FCEE21',
  HAPPY = '#BDE121',
  EXCITED = '#7ED321',
  UNKNOWN = 'transparent'
}

enum MOOD_VALUES {
  SAD = 1,
  MEH = 2,
  OKAY = 3,
  HAPPY = 4,
  EXCITED = 5
}

enum MOOD_ICONS {
  SAD = 'sentiment_very_dissatisfied',
  MEH = 'sentiment_dissatisfied',
  OKAY = 'sentiment_neutral',
  HAPPY = 'sentiment_satisfied',
  EXCITED = 'sentiment_very_satisfied'
}

@UntilDestroy()
@Component({
  selector: 'app-dieter-journal-food-table',
  templateUrl: 'expandable-table.component.html',
  styleUrls: ['expandable-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FoodExpandableTable implements OnInit {
  @Input() source: FoodDataSource

  public rows: FoodDayAmount[] = []
  public showFoodMoodAndNote = false

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialog: MatDialog,
    private food: FoodMeal,
    private notify: NotifierService
  ) {}

  ngOnInit() {
    this.cdr.detectChanges()

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((rows) => {
        this.rows = []
        this.cdr.detectChanges()

        this.rows = this.cleanData(rows)
        this.cdr.detectChanges()
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.showFoodMoodAndNote = resolveConfig(
        'JOURNAL.SHOW_FOOD_MOOD_AND_NOTE',
        org
      )
    })
  }

  private cleanData(rows: any[]): any[] {
    // Apply class for shading to level 0 and 2
    let level0Count = 0
    let level2Count = 0

    rows.forEach((t) => {
      level2Count = t.level !== 2 ? 0 : level2Count

      if (t.level === 0) {
        t.shading = level0Count % 2 === 1 ? 1 : 0
        level0Count++
      } else if (t.level === 1) {
        t.shading =
          t.type === 'FOOD.BREAKFAST' || t.type === 'FOOD.DINNER' ? 1 : 0
      } else if (t.level === 2) {
        t.shading = level2Count % 2 === 1 ? 1 : 0
        level2Count++
      }
    })

    return [
      ...rows.filter(
        (e) =>
          (e.level !== 2 || !e.meals) && (e.level !== 1 || e.type !== undefined)
      )
    ]
  }

  public checkOthersContents(row: FoodDayAmount): boolean {
    return !!(
      row.cholesterol ||
      row.sodium ||
      row.calcium ||
      row.iron ||
      row.potassium ||
      row.vitaminA ||
      row.vitaminB ||
      row.vitaminC ||
      row.vitaminD
    )
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
    if (row.level > 1) return

    // Determine the start and end index of the array to examine and potentially modify, instead of interating over whole set
    // ** ensure that the timezone is considered - I think we should be examining the date differently?
    const consumedDate =
      row.level === 1 ? row.meals[0].consumedDate : row.consumedDate
    const startIndex =
      row.level === 1
        ? this.rows.findIndex(
            (e) =>
              !e.consumedDate &&
              e.meals &&
              e.meals[0].consumedDate >= consumedDate &&
              e.type === row.type
          )
        : this.rows.findIndex(
            (e) => e.consumedDate && e.consumedDate >= consumedDate
          )
    let endIndex =
      row.level === 1
        ? this.rows.findIndex(
            (e, index) =>
              index > startIndex &&
              (e.consumedDate === undefined || e.consumedDate > consumedDate)
          )
        : this.rows.findIndex(
            (e) => e.consumedDate && e.consumedDate > consumedDate
          )

    // startIndex = startIndex === -1 ? 0 : startIndex
    endIndex = endIndex === -1 ? this.rows.length : endIndex

    row.isExpanded = !row.isExpanded

    switch (row.level) {
      case 0:
        this.rows.forEach((t, index) => {
          if (index < startIndex || index > endIndex) return

          if (t.level === 1 && row.isExpanded) {
            t.isExpanded = false
            t.isHidden = false
          } else if (t.level === 1 || t.level === 2) {
            t.isExpanded = false
            t.isHidden = true
          }
        })
        break

      case 1:
        this.rows.forEach((t, index) => {
          if (index < startIndex || index > endIndex) return

          this.fetchAndLoadServings(row.meals.filter((m) => m.id))

          if (t.level === 2) {
            t.isHidden = row.isExpanded ? false : true
          }
        })
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

  getMoodIcon(meal: ConsumedFood): string {
    switch (meal.moodRating) {
      case MOOD_VALUES.SAD:
        return MOOD_ICONS.SAD
      case MOOD_VALUES.MEH:
        return MOOD_ICONS.MEH
      case MOOD_VALUES.OKAY:
        return MOOD_ICONS.OKAY
      case MOOD_VALUES.HAPPY:
        return MOOD_ICONS.HAPPY
      case MOOD_VALUES.EXCITED:
        return MOOD_ICONS.EXCITED

      default:
        return
    }
  }

  getMoodIconColor(meal: ConsumedFood): string {
    switch (meal.moodRating) {
      case MOOD_VALUES.SAD:
        return MOOD_COLORS.SAD
      case MOOD_VALUES.MEH:
        return MOOD_COLORS.MEH
      case MOOD_VALUES.OKAY:
        return MOOD_COLORS.OKAY
      case MOOD_VALUES.HAPPY:
        return MOOD_COLORS.HAPPY
      case MOOD_VALUES.EXCITED:
        return MOOD_COLORS.EXCITED

      default:
        return MOOD_COLORS.UNKNOWN
    }
  }
}
