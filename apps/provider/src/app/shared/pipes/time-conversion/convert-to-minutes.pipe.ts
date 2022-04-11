import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'convertToMinutes'
})
export class CcrConvertSecondsToMinutesPipe implements PipeTransform {
  transform(seconds: number, leadingZeroAmount: number): string {
    const minutes = Math.floor(seconds / 60)
    return minutes.toString().padStart(leadingZeroAmount, '0')
  }
}
