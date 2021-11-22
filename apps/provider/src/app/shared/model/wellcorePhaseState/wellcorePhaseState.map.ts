export interface PhaseStateMapEntry {
  prodPhase: string
  testPhase: string
  states: string[]
}

export const WELLCORE_PHASE_STATE_MAP: {
  [key: string]: PhaseStateMapEntry
} = {
  florida: {
    prodPhase: '1529',
    testPhase: '819',
    states: ['florida', 'fl']
  },
  texas: {
    prodPhase: '1528',
    testPhase: '818',
    states: ['texas', 'tx']
  }
}
