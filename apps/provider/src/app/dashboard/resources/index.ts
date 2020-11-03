export * from './faqs';
export * from './marketing';
export * from './platform-updates';
export * from './support';

import { FaqsComponents, FaqsEntryComponents } from './faqs';
import { MarketingComponents, MarketingEntryComponents } from './marketing';
import { PlatformUpdatesComponent } from './platform-updates';
import { SupportComponents, SupportEntryComponents } from './support';

export const ResourcesComponents = [
  ...FaqsComponents,
  ...MarketingComponents,
  PlatformUpdatesComponent,
  ...SupportComponents
];

export const ResourcesEntryComponents = [
  ...FaqsEntryComponents,
  ...MarketingEntryComponents,
  ...SupportEntryComponents
];
