import * as tinycolor from 'tinycolor2'

import { Palette } from '../../shared/config'

const meetingColors = [
  '#d0a15a',
  '#a0315c',
  '#3191d3',
  '#235f26',
  '#c27dce',
  '#eed6a4',
  '#40a89f',
  '#9b4f3b',
  '#eda09b',
  '#676cbc',
  '#49bbd9',
  '#787433',
  '#c04d40',
  '#72cc7e',
  '#8c8c8c',
  '#4d4d4d'
]

export function generateMeetingTypeColor(index: number) {
  // unique color for first 15 meeting types and use the same 'other' color from 16th or above
  const num = Math.min(index, 15)

  const color = meetingColors[num]
  const light = tinycolor(color).lighten(20)

  const options = {
    includeFallbackColors: true
  }

  // get the most readable black/white
  const contrast = tinycolor
    .mostReadable(
      color,
      [Palette.text, tinycolor(Palette.text).lighten(60)],
      options
    )
    .toHexString()

  return {
    default: color,
    light,
    contrast
  }
}

export function getDefaultMeetingTypeColor() {
  const color = meetingColors[15]
  const light = tinycolor(color).lighten(20)

  const options = {
    includeFallbackColors: true
  }

  // get the most readable black/white
  const contrast = tinycolor
    .mostReadable(
      color,
      [Palette.text, tinycolor(Palette.text).lighten(60)],
      options
    )
    .toHexString()

  return {
    default: color,
    light,
    contrast
  }
}
