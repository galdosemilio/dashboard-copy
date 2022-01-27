import { _ } from '@app/shared/utils'

export interface RouteTitleEntry {
  routeSegments: string[]
  title: string
}

export const WELLCORE_ROUTE_TITLE: { [key: string]: RouteTitleEntry } = {
  dashboard: {
    routeSegments: ['dashboard'],
    title: _('SIDENAV.DASHBOARD')
  },
  appointments: {
    routeSegments: ['schedule', '**'],
    title: _('GLOBAL.APPOINTMENTS')
  },
  newAppointments: {
    routeSegments: ['new-appointment'],
    title: _('GLOBAL.APPOINTMENTS')
  },
  testResults: {
    routeSegments: ['test-results'],
    title: _('SIDENAV.TEST_RESULTS')
  },
  messages: {
    routeSegments: ['messages'],
    title: _('SIDENAV.MESSAGES')
  },
  account: {
    routeSegments: ['profile'],
    title: _('SIDENAV.ACCOUNT')
  },
  digitalLibrary: {
    routeSegments: ['library'],
    title: _('SIDENAV.LIBRARY')
  },
  digitalLibraryDeep: {
    routeSegments: ['library', '**'],
    title: _('SIDENAV.LIBRARY')
  }
}
