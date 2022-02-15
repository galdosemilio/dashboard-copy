import { DeviceDetectorService } from 'ngx-device-detector'

function isChrome(deviceDetector: DeviceDetectorService): boolean {
  const browserPattern = /chrome/gi
  return browserPattern.test(deviceDetector.browser)
}

export const Browser = { isChrome }
