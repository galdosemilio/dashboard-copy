interface RouteEntryLike {
  routeSegments: string[]
}

export class RouteUtils {
  static findRouteEntry<T extends RouteEntryLike>(
    entries: T[],
    urlSegments: string[]
  ): T | undefined {
    return entries.find((routeEntry) => {
      const inputUrlSegments = urlSegments.slice()
      const routeSegments = routeEntry.routeSegments.slice()

      let validEntry = true
      let isSearching = true

      while (isSearching && routeSegments.length) {
        const segment = routeSegments.shift()
        const inputUrlSegment = inputUrlSegments.shift()

        if (segment === '**') {
          isSearching = false
          continue
        }

        if (
          (segment !== '*' && !inputUrlSegment?.includes(segment)) ||
          (!routeSegments.length &&
            routeSegments.length !== inputUrlSegments.length)
        ) {
          isSearching = false
          validEntry = false
        }
      }

      return validEntry
    })
  }
}
