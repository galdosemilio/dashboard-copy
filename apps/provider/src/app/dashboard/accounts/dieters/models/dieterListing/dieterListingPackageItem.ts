import { ExpandableTableItem } from '@app/shared';

export class DieterListingPackageItem implements ExpandableTableItem {
  id?: string;
  isEmpty: boolean;
  isExpanded: boolean;
  isHidden: boolean;
  isLastOfGroup: boolean;
  level: number;
  name: string;
  startedAt: string;

  constructor(args: any) {
    this.id = args.id;
    this.isEmpty = args.isEmpty || false;
    this.isExpanded = args.isExpanded || false;
    this.isHidden = args.isHidden || false;
    this.level = args.level || 0;
    this.name = args.name;
    this.startedAt = args.startedAt || '';
  }
}
