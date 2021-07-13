import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import {
  convertToReadableFormat,
  MeasurementDataPointType
} from '@coachcare/sdk'

@Pipe({ name: 'unitConvertToReadable' })
export class UnitConvertToReadablePipe implements PipeTransform {
  private noDecimalTypes: string[] = ['47', '48']

  constructor(private context: ContextService) {}

  transform(
    value: number,
    type: MeasurementDataPointType,
    toFixed: number = 1
  ): string {
    return convertToReadableFormat(
      value,
      type,
      this.context.user.measurementPreference
    ).toFixed(this.noDecimalTypes.includes(type.id) ? 0 : toFixed)
  }
}
