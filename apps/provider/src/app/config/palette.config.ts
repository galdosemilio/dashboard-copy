/**
 * Palette used inside Typescript Code.
 */

import { drop, flatten, invokeMap, zip } from 'lodash'
import tinycolor from 'tinycolor2'
import { CCRColors, CCRColorsPalette, CCRPalette } from './config.interface'

export const Palette: CCRPalette = {
  background: '#cacaca',
  bg_bar: '#ffffff',
  bg_panel: '#f5f5f5',
  primary: '#f05d5c',
  accent: '#f8b1b1',
  warn: '#f05d5c', // '#f44336',
  base: '#504c4a',
  text: '#484848',
  contrast: '#ffffff',
  sidenav: '#dedede',
  toolbar: 'primary'
}

/**
 * List of colors to be used sequentially
 */
const COLORS: CCRColorsPalette = [
  // default, contrast
]

export const Colors: CCRColors = {
  update(palette: CCRPalette): void {
    COLORS.length = 0

    const primary = palette.primary
    const accent =
      primary === palette.accent
        ? tinycolor(primary).lighten(20).toHexString()
        : palette.accent

    const mix1 = tinycolor.mix(primary, accent, 33)
    const mix2 = tinycolor.mix(primary, accent, 66)

    const c1 = drop(
      tinycolor(primary).setAlpha(0.7).desaturate().analogous(),
      3
    )
    const c2 = drop(tinycolor(mix1).setAlpha(0.7).desaturate().analogous(), 3)
    const c3 = drop(tinycolor(mix2).setAlpha(0.7).desaturate().analogous(), 3)
    const c4 = drop(tinycolor(accent).setAlpha(0.7).desaturate().analogous(), 3)

    invokeMap(flatten(zip(c4, c3, c2, c1)), 'toHexString').forEach((c) => {
      COLORS.push([c, tinycolor(c).desaturate().darken(15).toHexString()])
    })
  },

  get(i: number, type?: 'default' | 'contrast'): string {
    const k = i % COLORS.length
    type = type ? type : 'default'
    return COLORS[k][type === 'default' ? 0 : 1]
  },

  list(type?: 'default' | 'contrast'): Array<string> {
    const result = []
    for (let i = 0; i < COLORS.length; i++) {
      result.push(Colors.get(i, type))
    }
    return result
  }
}
