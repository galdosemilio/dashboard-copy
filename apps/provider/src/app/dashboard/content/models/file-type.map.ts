import { Icon } from '@app/dashboard/content/models/icon.interface'
import { _ } from '@app/shared'

export interface FileTypeMapItem {
  icon: Icon
  name: string
  mimeType: string | string[]
}

export const FILE_TYPE_MAP: { [name: string]: FileTypeMapItem } = {
  ['pdf']: {
    icon: { name: 'fa-file-pdf', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PDF'),
    mimeType: 'application/pdf'
  },
  ['jpeg']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.JPEG'),
    mimeType: 'image/jpeg'
  },
  ['jpg']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.JPEG'),
    mimeType: 'image/jpeg'
  },
  ['png']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.PNG'),
    mimeType: 'image/png'
  },
  ['doc']: {
    icon: { svgIcon: 'svg-document' },
    name: _('LIBRARY.CONTENT.TYPE.DOC'),
    mimeType: 'application/msword'
  },
  ['docx']: {
    icon: { svgIcon: 'svg-document' },
    name: _('LIBRARY.CONTENT.TYPE.DOC'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  ['xls']: {
    icon: { name: 'fa-file-excel', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.XLS'),
    mimeType: 'application/vnd.ms-excel'
  },
  ['xlsx']: {
    icon: { name: 'fa-file-excel', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.XLS'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  ['ppt']: {
    icon: { name: 'fa-file-powerpoint', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PPT'),
    mimeType: 'application/vnd.ms-powerpoint'
  },
  ['pptx']: {
    icon: { name: 'fa-file-powerpoint', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PPT'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  ['txt']: {
    icon: { name: 'fa-file-alt', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.TXT'),
    mimeType: 'text/plain'
  },
  ['rtf']: {
    icon: { name: 'fa-file-alt', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.RTF'),
    mimeType: 'application/rtf'
  }
}
