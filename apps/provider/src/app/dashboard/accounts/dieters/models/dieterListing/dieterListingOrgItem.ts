import { ExpandableTableItem } from '@app/shared';

export class DieterListingOrgItem implements ExpandableTableItem {
  id?: string;
  isEmpty: boolean;
  isExpanded: boolean;
  isHidden: boolean;
  isLastOfGroup: boolean;
  name: string;
  level: number;
  startedAt: string;

  constructor(args: any) {
    this.id = args.id;
    this.isEmpty = args.isEmpty || false;
    this.isExpanded = args.isExpanded || false;
    this.isHidden = args.isHidden || false;
    this.name = args.name;
    this.level = args.level || 0;
    this.startedAt = args.changedAt || '';
  }
}
