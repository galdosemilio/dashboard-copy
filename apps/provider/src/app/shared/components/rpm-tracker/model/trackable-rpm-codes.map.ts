export type SupportedRPMBillingCode = '99453' | '99454' | '99457' | '99458';

export interface TrackableRPMCodeEntry {
  code: SupportedRPMBillingCode;
  deps?: string[];
  displayedCode?: string;
  maxEligibleAmount?: number;
  requiresTimeTracking?: boolean;
}

export const TRACKABLE_RPM_CODES: { [key: string]: TrackableRPMCodeEntry } = {
  99457: { code: '99457', maxEligibleAmount: 1, requiresTimeTracking: true },
  99458: {
    code: '99458',
    maxEligibleAmount: 2,
    requiresTimeTracking: true,
    deps: ['99457']
  }
};

export function getNextTrackableRPMCode(
  currentCode: SupportedRPMBillingCode
): TrackableRPMCodeEntry {
  const trackableRPMCodes = Object.values(TRACKABLE_RPM_CODES);
  const currentIndex = trackableRPMCodes.findIndex(
    (trackableCode) => trackableCode.code === currentCode
  );

  if (currentIndex === -1 || currentIndex >= trackableRPMCodes.length) {
    return null;
  }

  return trackableRPMCodes[currentIndex + 1];
}
