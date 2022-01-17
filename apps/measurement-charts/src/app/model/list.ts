export interface ListItem {
  id: string
  groupId: string
  createdAt: string
  recordedAt: string
  timestamp: string
  name: string
  source: string
  unit?: string
  value: string | number
  count?: number
}
