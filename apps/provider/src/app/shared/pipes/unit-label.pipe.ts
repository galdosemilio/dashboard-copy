import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import { Metric, unitLabel } from '@app/shared/utils'

@Pipe({ name: 'unitLabel' })
export class UnitLabelPipe implements PipeTransform {
  constructor(private context: ContextService) {}

  /**
   * metric: required label
   */
  transform(metric: Metric, value = 2000 /* plural by default */) {
    const pref = this.context.user.measurementPreference || 'us'

    return value === undefined ? undefined : unitLabel(pref, metric, value)
  }
}
