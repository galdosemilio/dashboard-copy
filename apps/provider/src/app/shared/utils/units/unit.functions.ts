import { AccountMeasurementPreferenceType } from '@app/shared/selvera-api';

import { INCH, Metric, POUND } from './conversion.types';

export function uxPoundsToGrams(pref: AccountMeasurementPreferenceType, x: number) {
  switch (pref) {
    case 'metric':
      return x * 500; // aprox to 0.5 KG
    default:
      return x * POUND; // exact LB
  }
}

export function uxAproximateGrams(pref: AccountMeasurementPreferenceType, grams: number) {
  const lbs = grams % 500 === 0 ? grams / 500 : Math.round(grams / POUND);

  switch (pref) {
    case 'metric':
      return lbs * 500; // aprox to 0.5 KG
    default:
      return lbs * POUND; // exact LB
  }
}

/**
 * Factor to multiply an input value to the backend unit.
 */
export function getInputFactor(
  pref: AccountMeasurementPreferenceType,
  metric: Metric
): number {
  switch (metric) {
    case 'circumference':
      // to milimenters
      switch (pref) {
        case 'metric':
          // cm
          return 10;
        default:
          // inches
          return INCH;
      }
    case 'composition':
      // to grams
      switch (pref) {
        case 'metric':
          // from kg
          return 1000;
        default:
          // from pounds
          return POUND;
      }
  }
  return 1;
}
