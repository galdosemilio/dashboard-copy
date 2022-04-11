import { Pipe, PipeTransform } from '@angular/core'
import { mapToReadableFormat, MeasurementDataPointType } from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'unitMapToReadable' })
export class UnitMapToRedablePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: number, type: MeasurementDataPointType): string {
    return mapToReadableFormat(value, type, this.translate.currentLang)
  }
}
