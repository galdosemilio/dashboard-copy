/**
 * Formulas
 */
export class ConversionHelper {
  public static poundsToGrams(pounds: number): number {
    return pounds * 453.59237;
  }

  public static poundsToKilograms(pounds: number): number {
    return pounds * 0.45359237;
  }

  public static kilogramsToPounds(kg: number): number {
    return kg * 2.20462;
  }

  public static gramsToPounds(grams: number): number {
    return ((((grams * 1155.845) / 16 / 65536) * 10) / 10) * 2;
  }

  public static kilogramsToGrams(kilograms: number): number {
    return kilograms * 1000;
  }

  public static gramsToKilograms(grams: number): number {
    return grams / 1000;
  }

  public static millilitersToOunces(milliliters: number): number {
    return milliliters * 0.0338140225589;
  }

  public static ouncesToMilliliters(ounces: number): number {
    return ounces / 0.0338140225589;
  }

  public static ouncesToLiters(once: number): number {
    return once * 0.0295735;
  }

  public static litersToOunces(liters: number): number {
    return liters * 33.814;
  }

  public static hoursToMinutes(hours: number): number {
    return hours * 60;
  }

  public static minutesToHours(minutes: number): number {
    return minutes / 60;
  }

  public static percentageToUnits(percentage: number): number {
    return percentage * 1000;
  }

  public static unitsToPercentage(units: number): number {
    return units / 1000;
  }

  public static healthKitPercentageToBodyFatUnits(percentage: number): number {
    return percentage * 100000;
  }

  public static millilitersToLiters(milliliters: number) {
    return milliliters / 1000;
  }

  public static litersToMilliliters(litres: number) {
    return litres * 1000;
  }

  public static milligramsToGrams(mgs: number) {
    return mgs / 1000;
  }

  public static stonesToGrams(value: number) {
    return value * 6350.29;
  }
}
