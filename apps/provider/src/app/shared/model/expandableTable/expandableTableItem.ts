export interface ExpandableTableItem {
  isEmpty: boolean;
  isExpanded: boolean;
  isHidden: boolean;
  isLastOfGroup?: boolean;
  level: number;
}
