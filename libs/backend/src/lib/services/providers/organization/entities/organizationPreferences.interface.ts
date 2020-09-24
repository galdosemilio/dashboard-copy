export interface OrganizationMala {
  /** The iOS bundle ID */
  iosBundleId?: string;
  /** The Android bundle ID */
  androidBundleId?: string;
  /** The app name */
  appName?: string;
  /** The firebase proejct name */
  firebaseProjectName?: string;
  /** The app store connect team ID */
  appStoreConnectTeamId?: string;
  /** The developer portal team ID */
  developerPortalTeamId?: string;
  /** Any remaining MALA settings, that will be merged into the output for the "mala" key */
  other?: any;
}
