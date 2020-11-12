import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: string): any {
    if (value) {
      return value.replace(
        /\b[^\s]+/g,
        (f) => f[0].toLocaleUpperCase() + f.substr(1)
      )
    }
    return value
  }
}
