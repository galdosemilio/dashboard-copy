/**
 * Interface for GET http://itunes.apple.com/lookup?bundleId=bundleId (Response)
 */
export interface AppStoreLookupResponse {
  resultCount: number
  results: Array<AppStoreResource>
}

/**
 * Interface for an AppStore Resource from the iTunes Search API
 */
export interface AppStoreResource {
  advisories: Array<string>
  appletvScreenshotUrls: Array<string>
  artistId: number
  artistName: string
  artistViewUrl: string
  artworkUrl100: string
  artworkUrl512: string
  artworkUrl60: string
  averageUserRating: number
  averageUserRatingForCurrentVersion: number
  bundleId: string
  contentAdvisoryRating: string
  currency: string
  currentVersionReleaseDate: string
  description: string
  features: Array<string>
  fileSizeBytes: string
  formattedPrice: string
  genreIds: Array<string>
  genres: Array<string>
  ipadScreenshotUrls: Array<string>
  isGameCenterEnabled: boolean
  isVppDeviceBasedLicensingEnabled: boolean
  kind: string
  languageCodesISO2A: Array<string>
  minimumOsVersion: string
  price: number
  primaryGenreId: number
  primaryGenreName: string
  releaseDate: string
  releaseNotes: string
  screenshotUrls: Array<string>
  sellerName: string
  supportedDevices: Array<string>
  trackCensoredName: string
  trackContentRating: string
  trackId: number
  trackName: string
  trackViewUrl: string
  userRatingCount: number
  userRatingCountForCurrentVersion: number
  version: string
  wrapperType: string
}
