export class FoodData {
  calories = { goal: 2000, avg: 0, amount: 0 }
  protein = { goal: 0, avg: 0, amount: 0 }
  carbohydrate = { goal: 0, avg: 0, amount: 0 }
  netCarbs = { goal: 0, avg: 0, amount: 0 }
  totalFat = { goal: 0, avg: 0, amount: 0 }
  sugar = { goal: 0, avg: 0, amount: 0 }
  fiber = { goal: 0, avg: 0, amount: 0 }
  saturatedFat = { goal: 0, avg: 0, amount: 0 }
  sodium = { goal: 0, avg: 0, amount: 0 }
  cholesterol = { goal: 0, avg: 0, amount: 0 }

  calculateAmount(meal) {
    this.calories.amount += meal.calories
    this.protein.amount += meal.protein
    this.totalFat.amount += meal.totalFat
    this.carbohydrate.amount += meal.carbohydrate
    this.sugar.amount += meal.sugar
    this.fiber.amount += meal.fiber
    this.saturatedFat.amount += meal.saturatedFat
    this.netCarbs.amount += meal.netCarbs
    this.sodium.amount += meal.sodium
    this.cholesterol.amount += meal.cholesterol
  }

  calculateAverage(daysNumber) {
    this.calories.avg = daysNumber ? this.calories.amount / daysNumber : 0
    this.protein.avg = daysNumber ? this.protein.amount / daysNumber : 0
    this.totalFat.avg = daysNumber ? this.totalFat.amount / daysNumber : 0
    this.carbohydrate.avg = daysNumber
      ? this.carbohydrate.amount / daysNumber
      : 0
    this.saturatedFat.avg = daysNumber
      ? this.saturatedFat.amount / daysNumber
      : 0
    this.fiber.avg = daysNumber ? this.fiber.amount / daysNumber : 0
    this.sugar.avg = daysNumber ? this.sugar.amount / daysNumber : 0
    this.netCarbs.avg = daysNumber ? this.netCarbs.amount / daysNumber : 0
    this.sodium.avg = daysNumber ? this.sodium.amount / daysNumber : 0
    this.cholesterol.avg = daysNumber ? this.cholesterol.amount / daysNumber : 0
  }
}
