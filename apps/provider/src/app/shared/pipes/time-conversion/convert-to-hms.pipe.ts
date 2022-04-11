import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'convertToHms'
})
export class CcrConvertSecondsToHmsPipe implements PipeTransform {
  transform(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }
}
