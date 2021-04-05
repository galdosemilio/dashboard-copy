export interface RPMReason {
  id: string
  description: string
  isActive: boolean
  requiresNote: boolean
  appliesToStateInStatus?: 'active' | 'inactive'
}
