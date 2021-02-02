export interface UpdateAccountThreadAssociation {
  /** The ID of the account */
  account: string
  /** A flag indicating whether the thread should be marked as active or not for the user */
  isActive: boolean
  /** The ID of the thread */
  threadId: string
}
