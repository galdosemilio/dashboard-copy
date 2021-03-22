import { NamedEntity } from '@coachcare/npm-api/selvera-api/providers/common/entities'

export const BODY_MEASUREMENT_TYPES: { [key: string]: NamedEntity } = {
  weight: {
    id: '1',
    name: 'weight'
  },
  leanMass: {
    id: '2',
    name: 'leanMass'
  },
  bodyFat: {
    id: '3',
    name: 'bodyFat'
  },
  hydration: {
    id: '13',
    name: 'hydration'
  },
  BMI: {
    id: '46',
    name: 'bmi'
  }
}
