export * from './bind-form.directive'
export * from './ccr-account-link.directive'
export * from './ccr-draggable.directive'
export * from './ccr-dropzone.directive'
export * from './ccr-link-active.directive'
export * from './detect-key.directive'
export * from './input-mask'
export * from './mutation-observer.directive'
export * from './number-only.directive'
export * from './table-sort'

import { BindFormDirective } from './bind-form.directive'
import { CcrAccountLinkDirective } from './ccr-account-link.directive'
import { CcrDraggableDirective } from './ccr-draggable.directive'
import { CcrDropzoneDirective } from './ccr-dropzone.directive'
import { CcrLinkActiveDirective } from './ccr-link-active.directive'
import { CcrTableSortDirective } from './table-sort'
import { DetectKeyDirective } from './detect-key.directive'
import { MutationObserverDirective } from './mutation-observer.directive'
import { NumberOnlyDirective } from './number-only.directive'
import { CcrInputMaskDirective } from './input-mask'

export const Directives = [
  BindFormDirective,
  CcrAccountLinkDirective,
  CcrDraggableDirective,
  CcrDropzoneDirective,
  CcrInputMaskDirective,
  CcrLinkActiveDirective,
  CcrTableSortDirective,
  DetectKeyDirective,
  MutationObserverDirective,
  NumberOnlyDirective
]
