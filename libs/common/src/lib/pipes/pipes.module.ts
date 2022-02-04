import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AbsoluteValuePipe } from './absolute-value.pipe'
import { ApplyFnPipe } from './apply-fn.pipe'
import { CapitalizePipe } from './capitalize.pipe'
import { MaxCharsPipe } from './max-chars.pipe'
import { NumberFormatPipe } from './number-format.pipe'
import { CcrSanitizePipe } from './sanitize.pipe'
import { ToOuncesPipe } from './to-ounces.pipe'
import { UtcPipe } from './utc.pipe'

@NgModule({
  imports: [CommonModule],
  declarations: [
    AbsoluteValuePipe,
    ApplyFnPipe,
    CapitalizePipe,
    CcrSanitizePipe,
    MaxCharsPipe,
    NumberFormatPipe,
    ToOuncesPipe,
    UtcPipe
  ],
  exports: [
    AbsoluteValuePipe,
    ApplyFnPipe,
    CapitalizePipe,
    CcrSanitizePipe,
    MaxCharsPipe,
    NumberFormatPipe,
    ToOuncesPipe,
    UtcPipe
  ]
})
export class CcrPipesModule {}
