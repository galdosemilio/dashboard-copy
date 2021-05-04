import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { Package, PackageSingle } from '@coachcare/sdk'

@Injectable()
export class LabelResolver implements Resolve<PackageSingle> {
  constructor(private pkg: Package, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<PackageSingle> {
    const id = route.paramMap.get('id') as string

    return this.pkg
      .getSingle({ id: id })
      .then((packageSingle: PackageSingle) => {
        return packageSingle
      })
      .catch(() => {
        // TODO notify error
        this.router.navigate(['/packages'])
        return Promise.reject(null)
      })
  }
}
