import { ActivatedRouteSnapshot } from '@angular/router'
import { DefaultRouteReuseStrategy } from './default.strategy'

/**
 * Custom Router Reuse Strategy.
 */
export class AppRouteReuseStrategy extends DefaultRouteReuseStrategy {
  /**
   * Determines if a route should be reused
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    current: ActivatedRouteSnapshot
  ): boolean {
    // avoid reusage for different item IDs
    const reuse = current.params.id === future.params.id
    return reuse && super.shouldReuseRoute(future, current)
  }
}
