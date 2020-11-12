import { AppConfig } from './app.config'
import { ChartConfig } from './chart.config'
import {
  AppBreakpoints,
  CCR_CONFIG,
  CCRApp,
  CCRConfig,
  CCRPalette,
  OrgColors
} from './config.interface'
import { IconsConfig } from './icons.config'
import { Colors, Palette } from './palette.config'

export {
  AppBreakpoints,
  CCR_CONFIG,
  CCRApp,
  CCRConfig,
  CCRPalette,
  Colors,
  IconsConfig,
  OrgColors,
  Palette
}

export * from './cookies.config'

export const Config: CCRConfig = {
  app: AppConfig,
  chart: ChartConfig,
  colors: Colors,
  palette: {
    background: '#cacaca',
    bg_bar: '#ffffff',
    sidenav: '#dedede'
  }
}
