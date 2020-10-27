import { Pipe, PipeTransform } from '@angular/core';
import { ContextService } from '@app/service';
import { Metric, unitConversion } from '@app/shared/utils';

@Pipe({ name: 'unitConversion' })
export class UnitConversionPipe implements PipeTransform {
  constructor(private context: ContextService) {}

  /**
   * value: comes from the backend
   * res: converted value with the User metric preference
   */
  transform(value: number, metric: Metric, toFixed: number | boolean = 1): any {
    const pref = this.context.user.measurementPreference || 'us';

    return value === undefined ? undefined : unitConversion(pref, metric, value, toFixed);
  }
}
