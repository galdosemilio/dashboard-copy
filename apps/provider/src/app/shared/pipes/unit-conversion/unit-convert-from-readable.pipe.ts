import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import {
  convertFromReadableFormat,
  MeasurementDataPointType
} from '@coachcare/sdk'

@Pipe({ name: 'unitConvertFromReadable' })
export class UnitConvertFromReadablePipe implements PipeTransform {
  constructor(private context: ContextService) {}

  transform(
    value: number,
    type: MeasurementDataPointType,
    toFixed: number = 1
  ): string {
    return convertFromReadableFormat(
      value,
      type,
      this.context.user.measurementPreference
    ).toFixed(toFixed)
  }
}
