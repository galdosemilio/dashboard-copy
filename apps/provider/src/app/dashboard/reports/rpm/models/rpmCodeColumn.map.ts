export const RPM_CODE_COLUMNS: { [key: string]: any } = {
  ['99453']: [
    {
      column: 'Education Provided',
      route: 'rpm.educationProvidedAtFormatted',
      default: 'No',
      defaultNoPlan: 'N/A',
      inParent: true
    },
    {
      column: 'Device Type',
      route: 'device.name',
      default: '-',
      inParent: true
    },
    {
      column: 'Device Supplied',
      route: 'rpm.deviceProvidedAtFormatted',
      default: 'No',
      defaultNoPlan: 'N/A',
      inParent: true
    }
  ],
  ['99454']: [
    {
      column: 'Device Type',
      route: 'device.name',
      default: '-',
      inParent: true
    },
    {
      column: 'Device Supplied',
      route: 'rpm.deviceProvidedAtFormatted',
      default: 'No',
      defaultNoPlan: 'N/A',
      inParent: true
    },
    {
      column: 'Transmissions of 16 days in Past 30 days (Next Claim)',
      route: 'eligibility.next.transmissions.transmissionsOf16',
      default: 'No',
      defaultNoPlan: 'N/A'
    },
    {
      column: '# of Alert Transmissions in past 30 days (Next Claim)',
      route: 'eligibility.next.transmissions.notification.count',
      default: '0',
      defaultNoPlan: 'N/A'
    },
    {
      column:
        '# of Automated Device Transmissions in past 30 days (Next Claim)',
      route: 'eligibility.next.transmissions.measurements.automated.count',
      default: '0',
      defaultNoPlan: 'N/A'
    }
  ],
  ['99457']: [
    {
      column: 'Monitoring First 20 min (Next Claim)',
      route: 'eligibility.next.monitoring.before20',
      default: '0'
    },
    {
      column: 'Live Interaction w/ Patient (Next Claim)',
      route: 'eligibility.next.liveInteraction.hasInteraction',
      default: 'No'
    }
  ],
  ['99458']: [
    {
      column: `Monitoring: add'l time (Next Claim)`,
      route: 'eligibility.next.monitoring.after20',
      default: '0'
    }
  ]
}

export const RPM_SINGLE_TIME_CODES: string[] = ['99453']
