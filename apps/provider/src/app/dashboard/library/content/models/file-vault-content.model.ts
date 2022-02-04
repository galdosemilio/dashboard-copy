import {
  CONTENT_TYPE_MAP,
  FileExplorerContent,
  FileExplorerContentOpts
} from '@app/dashboard/library/content/models'
import { _ } from '@app/shared/utils'

const EXTERNAL_VISIBILITY_MAP = {
  dashboard: {
    id: 'dashboard',
    name: _('BOARD.WELLCORE_DASHBOARD_ONLY')
  },
  prescribery: {
    id: 'prescribery',
    name: _('BOARD.WELLCORE_DASHBOARD_PRESCRIBERY')
  }
}

export class FileVaultContent extends FileExplorerContent {
  public exportTags?: string[]
  public externalVisibility?: string
  public externalVisibilityText = '-'

  constructor(args: any, opts?: FileExplorerContentOpts) {
    super(args, opts)
    this.exportTags = args.exportTags

    if (this.type.id.toString() !== CONTENT_TYPE_MAP.file.id) {
      return
    }

    this.externalVisibility = this.exportTags?.[0] ?? 'dashboard'

    this.externalVisibilityText =
      Object.values(EXTERNAL_VISIBILITY_MAP).find(
        (entry) => entry.id === this.externalVisibility
      )?.name ?? _('BOARD.WELLCORE_DASHBOARD_ONLY')
  }
}
