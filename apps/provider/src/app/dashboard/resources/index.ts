export * from './faqs'
export * from './marketing'
export * from './platform-updates'
export * from './support'

import { FaqsComponents } from './faqs'
import { MarketingComponents } from './marketing'
import { PlatformUpdatesComponent } from './platform-updates'
import { SupportComponents } from './support'

export const ResourcesComponents = [
  ...FaqsComponents,
  ...MarketingComponents,
  PlatformUpdatesComponent,
  ...SupportComponents
]
