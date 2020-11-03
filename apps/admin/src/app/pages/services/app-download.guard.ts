import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { MobileApp } from '@coachcare/npm-api'

@Injectable({
  providedIn: 'root'
})
export class AppDownloadGuard implements CanActivate {
  /**
   * App Downloader
   */
  constructor(private router: Router, private mobile: MobileApp) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    // validate the parameters
    const platform = route.params['platform']
    const organization = route.params['organization']

    if (['android', 'ios'].indexOf(platform) === -1) {
      this.router.navigate(['/not-found'])
      return true
    }
    if (!organization || isNaN(Number(organization))) {
      this.router.navigate(['/not-found'])
      return true
    }

    const getRedirect =
      platform === 'android'
        ? this.mobile.getAndroidRedirect.bind(this.mobile)
        : this.mobile.getiOsRedirect.bind(this.mobile)

    return getRedirect({ id: organization })
      .then((res) => {
        window.location.href = res.redirect
        return true
      })
      .catch(() => true)
  }
}
