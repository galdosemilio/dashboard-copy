import { Pipe, PipeTransform } from '@angular/core'
import { _ } from '@app/shared/utils'

/**
 * For theses values, keep in mind that 'min' is inclusive while
 * 'max' is exclusive, so that { min: 3, max: 6 } will yield the
 * following results:
 *
 * 3 = true
 * 4 = true
 * 2 = false
 * 6 = false
 *
 * Also, don't use 'float' values.
 *
 * -- Zcyon
 */
interface IntensityThreshold {
  min: number
  max: number
  name: string
}

@Pipe({ name: 'exerciseIntensity' })
export class ExerciseIntensityPipe implements PipeTransform {
  private intensityThresholds: IntensityThreshold[] = [
    {
      min: -1000,
      max: 3,
      name: _('GLOBAL.SEDENTARY')
    },
    {
      min: 3,
      max: 5,
      name: _('GLOBAL.LIGHT')
    },
    {
      min: 5,
      max: 7,
      name: _('GLOBAL.MODERATE')
    },
    {
      min: 7,
      max: 9,
      name: _('GLOBAL.VIGOROUS')
    },
    {
      min: 9,
      max: 1000,
      name: _('GLOBAL.MAXIMUM')
    }
  ]

  constructor() {}

  transform(value: number): string {
    const matchingThreshold = this.intensityThresholds.find(
      (iT: IntensityThreshold) => value >= iT.min && value < iT.max
    )
    return matchingThreshold.name
  }
}
