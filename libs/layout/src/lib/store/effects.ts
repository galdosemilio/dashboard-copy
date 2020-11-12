import { Type } from '@angular/core'
import { ResponsiveEffects } from './responsive/effects'
import { LayoutEffects } from './status/effects'

export const effects: Type<any>[] = [ResponsiveEffects, LayoutEffects]
