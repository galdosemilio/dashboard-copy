import { Icon } from '@app/dashboard/library/content/models/icon.interface'
import { _ } from '@app/shared'

export interface FileTypeMapItem {
  icon: Icon
  name: string
  mimeType: string | string[]
  readable: boolean
}

export const FILE_TYPE_MAP: { [name: string]: FileTypeMapItem } = {
  ['pdf']: {
    icon: { name: 'fa-file-pdf', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PDF'),
    mimeType: 'application/pdf',
    readable: true
  },
  ['jpeg']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.JPEG'),
    mimeType: 'image/jpeg',
    readable: true
  },
  ['jpg']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.JPEG'),
    mimeType: 'image/jpeg',
    readable: true
  },
  ['png']: {
    icon: { svgIcon: 'svg-photo' },
    name: _('LIBRARY.CONTENT.TYPE.PNG'),
    mimeType: 'image/png',
    readable: true
  },
  ['doc']: {
    icon: { svgIcon: 'svg-document' },
    name: _('LIBRARY.CONTENT.TYPE.DOC'),
    mimeType: 'application/msword',
    readable: false
  },
  ['docx']: {
    icon: { svgIcon: 'svg-document' },
    name: _('LIBRARY.CONTENT.TYPE.DOC'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    readable: false
  },
  ['xls']: {
    icon: { name: 'fa-file-excel', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.XLS'),
    mimeType: 'application/vnd.ms-excel',
    readable: false
  },
  ['xlsx']: {
    icon: { name: 'fa-file-excel', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.XLS'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    readable: false
  },
  ['ppt']: {
    icon: { name: 'fa-file-powerpoint', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PPT'),
    mimeType: 'application/vnd.ms-powerpoint',
    readable: false
  },
  ['pptx']: {
    icon: { name: 'fa-file-powerpoint', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.PPT'),
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    readable: false
  },
  ['txt']: {
    icon: { name: 'fa-file-alt', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.TXT'),
    mimeType: 'text/plain',
    readable: true
  },
  ['rtf']: {
    icon: { name: 'fa-file-alt', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.RTF'),
    mimeType: 'application/rtf',
    readable: false
  },
  ['mp4']: {
    icon: { name: 'fa-file-video', set: 'fas' },
    name: _('LIBRARY.CONTENT.TYPE.MP4'),
    mimeType: 'video/mp4',
    readable: true
  }
}
