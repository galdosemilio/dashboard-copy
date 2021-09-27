import { NotifierService } from '@app/service'
import { _, StatsDataSource } from '@app/shared'
import {
  FetchAllConsumedRequest,
  FoodConsumedSingle,
  GetAllFoodConsumedResponse
} from '@coachcare/sdk'
import * as moment from 'moment-timezone'
import { Observable } from 'rxjs'
import { ConsumedFood } from '../../models/consumedFood/consumedFood'
import { FoodData } from './food.data'
import { FoodDatabase } from './food.database'
import { FoodDayAmount } from './food.day-amount'

export class FoodDataSource extends StatsDataSource<
  FoodDayAmount,
  GetAllFoodConsumedResponse,
  FetchAllConsumedRequest,
  FoodData
> {
  TYPES = {
    breakfast: _('FOOD.BREAKFAST'),
    lunch: _('FOOD.LUNCH'),
    dinner: _('FOOD.DINNER'),
    snack: _('FOOD.SNACK')
  }

  constructor(
    protected notify: NotifierService,
    protected database: FoodDatabase
  ) {
    super()
  }

  defaultFetch(): GetAllFoodConsumedResponse {
    return { data: [], pagination: { next: null, prev: null } }
  }

  fetch(): Observable<GetAllFoodConsumedResponse> {
    return this.database.fetchAll(this.criteria)
  }

  mapResult(result: GetAllFoodConsumedResponse): FoodDayAmount[] {
    const parsedData =
      result.data && result.data.length
        ? result.data.map(
            (element: FoodConsumedSingle) => new ConsumedFood(element)
          )
        : []
    const data = this.calculateAmount(parsedData)
    this.stat$.next(data.progressCircleData)
    return data.tableData
  }

  private calculateAmount(consumedMealResponse: ConsumedFood[]) {
    const dayMeals = {
      tableData: [],
      // FIXME review the circleData goals
      progressCircleData: new FoodData()
    }

    const groupedDays = this.groupBy(consumedMealResponse, (meal) => [
      moment(meal.consumedDate).format('YYYY-MM-DD')
    ])
    const effectiveMeals: number = groupedDays.length
    this.addEmptyDays(groupedDays)
    this.addEmptyMeals(groupedDays)

    groupedDays.forEach((gd) => {
      const dayAmount = new FoodDayAmount(false, 0)
      const types = []
      gd.forEach((t) => {
        dayAmount.consumedDate = t.consumedDate
        dayAmount.calculateAmount(t)
        t.level = 1
        t.isHidden = true
        types.push(t)
      })
      const sortByData = this.sortBy(types)
      const groupedTypes = this.groupBy(sortByData, (item) => [item.type])
      groupedTypes.forEach((gt) => {
        const typeAmount = new FoodDayAmount(true, 1)
        gt.forEach((m) => {
          typeAmount.type = m.type
          typeAmount.moodRating = m.moodRating
          typeAmount.calculateAmount(m)
          m.level = 2
          m.isHidden = true
          typeAmount.meals.push(m)
        })
        dayAmount.types.push(typeAmount)
      })

      dayMeals.progressCircleData.calculateAmount(dayAmount)
      dayMeals.tableData.push(dayAmount)
      dayAmount.types.forEach((dt) => {
        dayMeals.tableData.push(dt)
        dayMeals.tableData.push(...dt.meals)
      })
    })
    dayMeals.progressCircleData.calculateAverage(effectiveMeals)

    return dayMeals
  }

  private groupBy(array, groupBy) {
    const groups = {}
    array.forEach((item) => {
      item.type = this.translateType(item.type)
      const groupName = JSON.stringify(groupBy(item))
      groups[groupName] = groups[groupName] || []
      groups[groupName].push(item)
    })

    return Object.keys(groups).map((group) => {
      return groups[group]
    })
  }

  private sortBy(array) {
    let sortByData = array.filter((item) => !item.type)
    Object.keys(this.TYPES).forEach((key) => {
      sortByData = sortByData.concat(
        array.filter(
          (item) => this.translateType(item.type) === this.TYPES[key]
        )
      )
    })
    return sortByData
  }

  private translateType(type) {
    return this.TYPES[type] ? this.TYPES[type] : type
  }

  private addEmptyMeals(groupedFood) {
    groupedFood.forEach((groupedDays) => {
      if (!groupedDays[0].isEmpty) {
        Object.keys(this.TYPES).forEach((type) => {
          if (!groupedDays.some((meal) => meal.type === type)) {
            this.addMeal(
              groupedDays,
              this.TYPES[type],
              groupedDays[0].consumedDate
            )
          }
        })
      }
    })
  }

  private addEmptyDays(groupedFood) {
    const endDate = moment(this.args.endDate)

    for (
      let currentDate = moment(this.args.startDate);
      currentDate.isSameOrBefore(endDate, 'day');
      currentDate = currentDate.add(1, 'day')
    ) {
      if (
        !groupedFood.some((day) =>
          moment(day[0].consumedDate).isSame(currentDate, 'day')
        )
      ) {
        const emptyFoodItem = new FoodDayAmount(false, 0)
        emptyFoodItem.consumedDate = currentDate.toISOString()
        groupedFood.push([emptyFoodItem])
      }
    }

    groupedFood.sort((a, b) => (a[0].consumedDate < b[0].consumedDate ? -1 : 1))
  }

  private addMeal(days, type, date) {
    const emptyFoodItem = new FoodDayAmount(true, 1)
    emptyFoodItem.type = type
    emptyFoodItem.consumedDate = date
    days.push(emptyFoodItem)
  }
}
