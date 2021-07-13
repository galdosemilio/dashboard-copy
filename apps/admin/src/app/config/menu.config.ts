import { _ } from '@coachcare/backend/shared'
import { MenuItem } from '@coachcare/common/shared'

/**
 * App Menu
 */
const provider: Array<MenuItem> = [
  {
    navName: _('GLOBAL.DASHBOARD'),
    navRoute: 'dashboard',
    icon: 'dashboard'
  },
  {
    navName: _('SIDENAV.ACCOUNTS'),
    route: 'accounts',
    icon: 'people outline',
    children: [
      {
        navName: _('GLOBAL.PATIENTS'),
        navRoute: 'accounts/patients',
        icon: 'person'
      },
      {
        navName: _('GLOBAL.COACHES'),
        navRoute: 'accounts/coaches',
        icon: 'assignment_ind'
      },
      {
        navName: _('GLOBAL.CLINICS'),
        navRoute: 'accounts/clinics',
        icon: 'domain'
      }
    ]
  },
  {
    navName: _('SIDENAV.SCHEDULE'),
    route: 'schedule',
    icon: 'date_range',
    children: [
      {
        navName: _('SIDENAV.SCHEDULE_VIEW'),
        navRoute: 'schedule/view',
        icon: 'schedule'
      },
      {
        navName: _('SIDENAV.SCHEDULE_AVAILABLE'),
        navRoute: 'schedule/available',
        icon: 'event_available'
      }
    ]
  },
  {
    navName: _('SIDENAV.MESSAGES'),
    route: 'messages',
    navRoute: 'messages',
    icon: 'chat',
    badge: 0
  },
  {
    navName: _('SIDENAV.LIBRARY'),
    route: 'library',
    navRoute: 'library',
    icon: 'folder'
  },
  {
    navName: _('SIDENAV.RESOURCES'),
    route: 'resources',
    icon: 'help',
    children: [
      {
        navName: _('SIDENAV.SUPPORT'),
        navLink: 'https://coachcare.zendesk.com/hc/en-us',
        icon: 'live_help'
      }
      // { navName: _('SIDENAV.MARKETING'), navRoute: 'resources/marketing' },
      // { navName: _('SIDENAV.FAQS'), navRoute: 'resources/faqs' }
    ]
  },
  {
    navName: _('SIDENAV.ALERTS'),
    route: 'alerts',
    icon: 'notifications',
    children: [
      {
        navName: _('SIDENAV.NOTIFICATIONS'),
        navRoute: 'alerts/notifications',
        icon: 'warning'
      },
      {
        navName: _('GLOBAL.SETTINGS'),
        navRoute: 'alerts/settings',
        icon: 'settings'
      }
    ]
  },
  {
    navName: _('SIDENAV.REPORTS'),
    navRoute: 'reports',
    icon: 'insert_chart',
    children: [
      {
        navName: _('SIDENAV.OVERVIEW'),
        navRoute: 'reports/overview',
        icon: 'equalizer'
      },
      {
        navName: _('SIDENAV.USER_STATISTICS'),
        navRoute: 'reports/statistics',
        icon: 'timeline'
      }
    ]
  }
]

const admin: Array<MenuItem> = [
  {
    route: 'organizations',
    navName: _('SIDENAV.ORGANIZATIONS'),
    navRoute: '/admin/organizations',
    icon: 'domain'
  },
  {
    route: '/admin/accounts',
    navName: _('SIDENAV.ACCOUNTS'),
    icon: 'people',
    expanded: true,
    children: [
      {
        navName: _('SIDENAV.PATIENTS'),
        navRoute: '/admin/accounts/patients',
        icon: 'person'
      },
      {
        navName: _('SIDENAV.COACHES'),
        navRoute: '/admin/accounts/coaches',
        icon: 'assignment_ind'
      },
      {
        navName: _('SIDENAV.ADMINS'),
        navRoute: '/admin/accounts/admins',
        icon: 'person_outline'
      }
    ]
  },
  {
    route: 'labels',
    navName: _('SIDENAV.LABELS'),
    navRoute: '/admin/labels',
    icon: 'business_center'
  },
  {
    route: 'measurements',
    navName: _('SIDENAV.MEASUREMENTS'),
    navRoute: '/admin/measurements',
    icon: 'collections_bookmark'
  },
  {
    route: 'reports',
    navName: 'Reports',
    icon: 'bar_chart',
    children: [
      {
        navName: 'Overview',
        navRoute: '/admin/reports/overview',
        icon: 'bar_chart'
      }
    ]
  }
]

export const appMenu = {
  admin,
  provider
}
