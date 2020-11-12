import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'applyFn'
})
export class ApplyFnPipe implements PipeTransform {
  transform(value: string, fn: (v: string) => string): string {
    return value ? fn(value) : value
  }
}
