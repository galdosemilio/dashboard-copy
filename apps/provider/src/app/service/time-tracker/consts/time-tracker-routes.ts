export interface TimeTrackerRoute {
  defaultParams?: string[]
  id: string
  ignoredParams?: string[]
  routeSegments: string[]
  tags: string[]
  useAccount?: boolean
  useParamMap?: boolean
}

export const TIME_TRACKER_ROUTES: { [key: string]: TimeTrackerRoute } = {
  patients: {
    id: '1',
    useAccount: false,
    routeSegments: ['accounts', 'patients'],
    tags: ['patient', 'listing']
  },
  patientProfileRoot: {
    id: '2',
    useAccount: true,
    routeSegments: ['accounts', 'patients', '*'],
    tags: ['patient', 'profile', 'dashboard']
  },
  patientProfile: {
    id: '2',
    useAccount: true,
    routeSegments: ['accounts', 'patients', '*', 'dashboard'],
    tags: ['patient', 'profile', 'dashboard']
  },
  patientJournal: {
    id: '3',
    defaultParams: ['food'],
    useAccount: true,
    useParamMap: true,
    routeSegments: ['accounts', 'patients', '*', 'journal'],
    tags: ['patient', 'profile', 'journal']
  },
  patientMeasurements: {
    id: '4',
    defaultParams: ['composition', 'table'],
    useAccount: true,
    useParamMap: true,
    routeSegments: ['accounts', 'patients', '*', 'measurements'],
    tags: ['patient', 'profile', 'measurements']
  },
  patientMessages: {
    id: '5',
    useAccount: true,
    routeSegments: ['accounts', 'patients', '*', 'messages'],
    tags: ['patient', 'profile', 'messages']
  },
  patientSettings: {
    id: '6',
    defaultParams: ['profile'],
    useAccount: true,
    useParamMap: true,
    routeSegments: ['accounts', 'patients', '*', 'settings'],
    tags: ['patient', 'profile', 'settings']
  },
  mainDashboard: {
    id: '7',
    routeSegments: ['dashboard'],
    tags: ['provider', 'dashboard']
  },
  providerListing: {
    id: '9',
    routeSegments: ['accounts', 'coaches'],
    tags: ['coach', 'listing']
  },
  providerOwnProfile: {
    id: '8',
    routeSegments: ['profile'],
    tags: ['provider', 'profile']
  },
  providerProfile: {
    id: '10',
    defaultParams: ['dashboard'],
    ignoredParams: ['profile'],
    useParamMap: true,
    routeSegments: ['accounts', 'coaches', '*'],
    tags: ['coach', 'profile']
  },
  clinicListing: {
    id: '11',
    routeSegments: ['accounts', 'clinics'],
    tags: ['clinics', 'listing']
  },
  scheduleList: {
    id: '12',
    routeSegments: ['schedule', 'list'],
    tags: ['schedule', 'list']
  },
  scheduleCalendar: {
    id: '13',
    routeSegments: ['schedule', 'view'],
    tags: ['schedule', 'calendar']
  },
  scheduleRecurringAvailabilityRoot: {
    id: '14',
    routeSegments: ['schedule', 'available'],
    tags: ['schedule', 'availability', 'recurring']
  },
  scheduleRecurringAvailability: {
    id: '14',
    routeSegments: ['schedule', 'available', 'recurring'],
    tags: ['schedule', 'availability', 'recurring']
  },
  scheduleSingleAvailability: {
    id: '15',
    routeSegments: ['schedule', 'available', 'single'],
    tags: ['schedule', 'availability', 'single']
  },
  messages: {
    id: '16',
    routeSegments: ['messages'],
    tags: ['messages']
  },
  libraryContentRoot: {
    id: '17',
    routeSegments: ['library'],
    tags: ['library', 'content']
  },
  libraryContent: {
    id: '17',
    routeSegments: ['library', 'content'],
    tags: ['library', 'content']
  },
  libraryForms: {
    id: '18',
    routeSegments: ['library', 'forms'],
    tags: ['library', 'forms']
  },
  alertNotifications: {
    id: '19',
    routeSegments: ['alerts', 'notifications'],
    tags: ['alerts', 'notifications']
  },
  alertSettingss: {
    id: '20',
    routeSegments: ['alerts', 'settings'],
    tags: ['alerts', 'settings']
  },
  reportOvRoot: {
    id: '21',
    routeSegments: ['reports', 'overview'],
    tags: ['reports', 'overview', 'signups']
  },
  reportOvSignups: {
    id: '21',
    routeSegments: ['reports', 'overview', 'signups'],
    tags: ['reports', 'overview', 'signups']
  },
  reportOvEnrollments: {
    id: '22',
    routeSegments: ['reports', 'overview', 'enrollments'],
    tags: ['reports', 'overview', 'enrollments']
  },
  reportOvActive: {
    id: '23',
    routeSegments: ['reports', 'overview', 'active'],
    tags: ['reports', 'overview', 'active']
  },
  reportStatRoot: {
    id: '24',
    routeSegments: ['reports', 'statistics'],
    tags: ['reports', 'statistics', 'patient']
  },
  reportStatPatient: {
    id: '24',
    routeSegments: ['reports', 'statistics', 'patient'],
    tags: ['reports', 'statistics', 'patient']
  },
  reportStatCoach: {
    id: '25',
    routeSegments: ['reports', 'statistics', 'coach'],
    tags: ['reports', 'statistics', 'coach']
  },
  reportStatActivityRoot: {
    id: '26',
    routeSegments: ['reports', 'statistics', 'activity'],
    tags: ['reports', 'statistics', 'activity', 'weight']
  },
  reportStatActivityWeight: {
    id: '26',
    routeSegments: ['reports', 'statistics', 'activity', 'weight'],
    tags: ['reports', 'statistics', 'activity', 'weight']
  },
  reportStatActivitySleep: {
    id: '27',
    routeSegments: ['reports', 'statistics', 'activity', 'sleep'],
    tags: ['reports', 'statistics', 'activity', 'sleep']
  },
  reportStatActivitySteps: {
    id: '28',
    routeSegments: ['reports', 'statistics', 'activity', 'steps'],
    tags: ['reports', 'statistics', 'activity', 'steps']
  },
  reportRpmRoot: {
    id: '29',
    routeSegments: ['reports', 'rpm'],
    tags: ['reports', 'rpm', 'billing']
  },
  reportRpmBilling: {
    id: '29',
    routeSegments: ['reports', 'rpm', 'billing'],
    tags: ['reports', 'rpm', 'billing']
  },
  reportCommsRoot: {
    id: '30',
    routeSegments: ['reports', 'communications'],
    tags: ['reports', 'communications', 'communications']
  },
  reportCommsCalls: {
    id: '30',
    routeSegments: ['reports', 'communications', 'communications'],
    tags: ['reports', 'communications', 'communications']
  },
  sequencesListing: {
    id: '31',
    routeSegments: ['sequences'],
    tags: ['sequences', 'listing']
  },
  sequence: {
    id: '32',
    routeSegments: ['sequences', 'sequence', '*'],
    tags: ['sequences', 'single']
  }
}
