export interface ExpandableTableItem<T = unknown> {
  children?: ExpandableTableItem<T>[]
  isEmpty: boolean
  isExpanded: boolean
  isHidden: boolean
  isLastOfGroup?: boolean
  level: number
}
