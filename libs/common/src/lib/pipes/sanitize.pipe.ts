import { Pipe, PipeTransform } from '@angular/core'
import { Sanitizer } from '../shared/utils/sanitizer'

@Pipe({
  name: 'ccrSanitize'
})
export class CcrSanitizePipe implements PipeTransform {
  transform(value: string): string {
    return Sanitizer.sanitizeTranslationString(value)
  }
}
