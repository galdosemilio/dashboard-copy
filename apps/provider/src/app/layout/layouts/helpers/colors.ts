import { Renderer2 } from '@angular/core'
import { CCRPalette } from '@app/config'
import * as tinycolor from 'tinycolor2'

export function applyPalette(
  palette: CCRPalette,
  renderer: Renderer2,
  document: Document
): void {
  const primary = palette.theme === 'accent' ? palette.accent : palette.primary
  const accent = palette.theme === 'accent' ? palette.primary : palette.accent

  renderer.setAttribute(
    document.body,
    'style',
    `
    --primary: ${primary};
    --primary-contrast: ${getContrast(primary)};
    --primary-lighten: ${tinycolor(primary).lighten(26)};
    --primary-lighten-contrast: ${getLightContrast(
      tinycolor(primary).lighten(26)
    )};
    --primary-contrast-light: ${getLightContrast(tinycolor(primary)).lighten(
      52
    )};
    --primary-darken: ${tinycolor(primary).darken(26)};
    --primary-a12: ${tinycolor(primary).setAlpha(0.12)};
    --primary-a26: ${tinycolor(primary).setAlpha(0.26)};
    --primary-a40: ${tinycolor(primary).setAlpha(0.4)};
    --primary-a60: ${tinycolor(primary).setAlpha(0.6)};
    --primary-a80: ${tinycolor(primary).setAlpha(0.8)};
    --accent: ${accent};
    --accent-contrast: ${getContrast(accent)};
    --accent-lighten: ${tinycolor(accent).lighten(26)};
    --accent-a12: ${tinycolor(accent).setAlpha(0.12)};
    --accent-a26: ${tinycolor(accent).setAlpha(0.26)};
    --warn: ${palette.warn};
    --warn-contrast: ${getContrast(palette.warn)};
    --warn-lighten: ${tinycolor(palette.warn).lighten(26)};
    --warn-a12: ${tinycolor(palette.warn).setAlpha(0.12)};
    --warn-a26: ${tinycolor(palette.warn).setAlpha(0.26)};
    --contrast: ${palette.contrast};
    --contrast-darken: ${tinycolor(palette.contrast).darken(8)};
    --contrast-darkest: ${tinycolor(palette.contrast).darken(12)};
    --sidenav: ${palette.sidenav};
    --sidenav-darken: ${tinycolor(palette.sidenav).darken(5)};
    --sidenav-darkest: ${tinycolor(palette.sidenav).darken(8)};

    --toolbar: ${palette.toolbar === 'accent' ? accent : primary};
    --toolbar-contrast: ${palette.contrast};

    --background: ${palette.background};
    --bg-bar: ${palette.bg_bar};
    --bg-bar-dark: ${tinycolor(palette.bg_bar).darken(50)};
    --bg-panel: ${palette.bg_panel};
    --base: ${palette.base};
    --text: ${palette.text};
    --text-light: ${tinycolor(palette.text).lighten(15)};
    --text-lighter: ${tinycolor(palette.text).lighten(30)};
    --text-lightest: ${tinycolor(palette.text).lighten(60)};
    --disabled: ${palette.disabled};
    `
  )
}

function getContrast(color: string) {
  // darken the color to raise the readability umbral
  return tinycolor.mostReadable(tinycolor(color).darken(10), [
    '#ffffff',
    '#504c4a'
  ])
}

function getLightContrast(color: string) {
  // lighten the color to raise the readability umbral
  return tinycolor.mostReadable(tinycolor(color).lighten(10), [
    '#ffffff',
    '#504c4a'
  ])
}
