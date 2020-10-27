import { Icon } from '@app/dashboard/content/models/icon.interface';
import { _ } from '@app/shared';
import { ContentType } from '@app/shared/selvera-api';

/**
 * This maps known code names to Angular Material icons.
 * You can see the list here: https://material.io/tools/icons/?style=baseline
 *
 * -- Zcyon
 */
export interface ContentTypeMapItem extends Partial<ContentType> {
  id: string;
  code: string;
  set?: string;
  icon: Icon;
  name: string;
  fetchProperties?(): any;
}

export const CONTENT_TYPE_MAP: { [name: string]: ContentTypeMapItem } = {
  default: {
    id: '',
    code: 'default',
    icon: { name: 'fa-file', set: 'fas' },
    name: _('LIBRARY.CONTENT.ALL')
  },
  folder: {
    id: '1',
    code: 'folder',
    icon: { svgIcon: 'svg-folder' },
    name: _('LIBRARY.CONTENT.FOLDER')
  },
  file: {
    id: '2',
    code: 'file',
    icon: { name: 'fa-file', set: 'fas' },
    name: _('LIBRARY.CONTENT.FILE')
  },
  form: {
    id: '3',
    code: 'form',
    icon: { svgIcon: 'svg-form' },
    name: _('LIBRARY.CONTENT.FORM')
  },
  document: {
    id: '4',
    code: 'document',
    icon: { name: 'fa-file', set: 'fas' },
    name: _('LIBRARY.CONTENT.DOCUMENT')
  },
  hyperlink: {
    id: '5',
    code: 'hyperlink',
    icon: { svgIcon: 'svg-url' },
    name: _('LIBRARY.CONTENT.HYPERLINK'),
    fetchProperties: () => ({
      type: '2',
      mimeType: 'text/html'
    })
  },
  youtube: {
    id: '6',
    code: 'youtube',
    icon: { set: 'fab', name: 'fa-youtube' },
    name: _('LIBRARY.CONTENT.YOUTUBE'),
    fetchProperties: () => ({
      type: '2',
      mimeType: 'text/html'
    })
  }
};
