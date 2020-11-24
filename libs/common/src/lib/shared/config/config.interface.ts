/**
 * Application Configuration
 */
import { InjectionToken } from '@angular/core'
import { DataObject } from '@coachcare/common/shared'
import { MenuItem } from '../tokens/ccr.menu'
import { AppLocaleCode } from './i18n.config'

/**
 * Configuration Injection Token
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config')

/**
 * API Settings Template
 */
export interface ApiSettings {
  avatar: {
    default: string // usually the avatar.png inside ./assets
    path: string // with token :id to replace
  }
}

/**
 * Responsive Breakpoints
 */
export interface AppBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
}

/**
 * Configuration Template
 */
export interface AppConfig {
  api: ApiSettings
  app: AppSettings
  menu: {
    [role: string]: Array<MenuItem>
  }
  // TODO define here any mandatory config field
  [field: string]: any
}

/**
 * Palette Template
 */
export interface AppPalette {
  bg_bar: string
  bg_panel: string
  primary: string
  accent: string
  warn: string
  base: string
  text: string
  contrast: string
  disabled: string
  sidenav: string
  theme: 'primary' | 'accent'
  toolbar: 'primary' | 'accent'
  panel: 'primary' | 'accent'
  [color: string]: string
}

export type AppColorsPalette = Array<[string, string]>

export interface AppColors {
  update(palette: AppPalette): void
  get(i: number, type?: 'default' | 'contrast'): string
  list(type?: 'default' | 'contrast'): Array<string>
}

/**
 * Application Settings Template
 */
export interface AppSettings {
  account: {
    profile(account: { id: any; accountType: any }): string
    role(accountType: any): string
  }
  default?: DataObject
  durations: {
    notifier: number
  }
  layout: LayoutSettings
  limit?: DataObject
  lang: {
    default: AppLocaleCode
    supported: Array<AppLocaleCode>
  }
  moment?: {
    thresholds: {
      [key: string]: number
    }
  }
  refresh?: DataObject
  screen: AppBreakpoints
}

/**
 * Layout Config Template
 */
export interface LayoutSettings {
  footer: {
    clinic: string
    company?: string
  }
}
