import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'minToHours'
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(value: number): string {
    const val = Math.round(+(value / 60) * 4) / 4
    return Number.isInteger(value) ? val.toString() : val.toFixed(2)
  }
}
