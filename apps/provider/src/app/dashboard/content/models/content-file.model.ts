import {
  CONTENT_TYPE_MAP,
  ContentTypeMapItem
} from '@app/dashboard/content/models/content-type.map';
import {
  FileExplorerContent,
  FileExplorerContentMetadata
} from '@app/dashboard/content/models/file-explorer-content.model';
import { FILE_TYPE_MAP } from '@app/dashboard/content/models/file-type.map';
import { Icon } from '@app/dashboard/content/models/icon.interface';
import { Package } from '@app/dashboard/content/models/package.model';

export class ContentFile implements Partial<FileExplorerContent> {
  public file: File;
  public name: string;
  public type: ContentTypeMapItem;
  public icon: Icon;
  public isPublic: boolean;
  public description: string;
  public extension: string;
  public metadata?: FileExplorerContentMetadata;
  public parentId?: string;
  parent?: string;
  public packages?: Package[];
  public hasPackageAssociations?: boolean;

  constructor(args: any) {
    this.file = args.file;
    this.name = args.fullName || args.name;
    this.description = args.description || undefined;
    this.isPublic = args.isPublic;
    this.parentId = args.parentId;
    this.parent = args.parentId || args.parent;
    this.type = args.type;
    if (this.type.code === 'file') {
      this.extension = args.fullName.substring(
        args.fullName.lastIndexOf('.') + 1,
        args.fullName.length
      );
    }

    if (FILE_TYPE_MAP[this.extension]) {
      this.icon = FILE_TYPE_MAP[this.extension].icon;
      this.type.name = FILE_TYPE_MAP[this.extension].name;
    } else {
      this.icon = CONTENT_TYPE_MAP[this.type.code]
        ? CONTENT_TYPE_MAP[this.type.code].icon
        : CONTENT_TYPE_MAP.default.icon;
    }

    this.packages = args.packages;
    this.hasPackageAssociations = args.hasPackageAssociations;
  }
}
