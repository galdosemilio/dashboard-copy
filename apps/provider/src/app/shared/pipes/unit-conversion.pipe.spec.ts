import { UnitConversionPipe } from './unit-conversion.pipe'

const metricUserPref: any = { user: { measurementPreference: 'metric' } }
const usUserPref: any = { user: { measurementPreference: 'us' } }

let unitConversionPipe = new UnitConversionPipe(metricUserPref)

describe('UnitConversionPipe Tests', () => {
  describe('For metric system', () => {
    beforeAll(() => {
      unitConversionPipe = new UnitConversionPipe(metricUserPref)
    })

    it('Should properly return a composition value', () => {
      expect(unitConversionPipe.transform(10000, 'composition')).toBe('10.0')
    })

    it('Should properly return a circumference value', () => {
      expect(unitConversionPipe.transform(1000, 'circumference')).toBe('100.0')
    })

    it('Should properly return a distance value', () => {
      expect(unitConversionPipe.transform(1000, 'distance')).toBe('1.0')
    })

    it('Should properly return a volume value', () => {
      expect(unitConversionPipe.transform(1000, 'volume')).toBe('1.0')
    })

    it('Should properly return a height value', () => {
      expect(unitConversionPipe.transform(1000, 'height')).toBe('1000.0')
    })

    it('Should properly return a temperature value', () => {
      expect(unitConversionPipe.transform(1000, 'temperature-push')).toBe(
        '1000.0'
      )
      expect(unitConversionPipe.transform(1000, 'temperature-fetch')).toBe(
        '1000.0'
      )
    })
  })

  describe('For US/UK system', () => {
    beforeAll(() => {
      unitConversionPipe = new UnitConversionPipe(usUserPref)
    })

    it('Should properly convert a composition value', () => {
      expect(unitConversionPipe.transform(10000, 'composition')).toBe('22.0')
    })

    it('Should properly convert a circumference value', () => {
      expect(unitConversionPipe.transform(1000, 'circumference')).toBe('39.4')
    })

    it('Should properly convert a distance value', () => {
      expect(unitConversionPipe.transform(1000, 'distance')).toBe('0.6')
    })

    it('Should properly convert a volume value', () => {
      expect(unitConversionPipe.transform(1000, 'volume', 2)).toBe('33.81')
    })

    it('Should properly return a speed value', () => {
      expect(unitConversionPipe.transform(1000, 'speed')).toBe('1000.0')
    })

    it('Should properly convert a temperature value', () => {
      expect(unitConversionPipe.transform(1832, 'temperature-push')).toBe(
        '1000.0'
      )
      expect(unitConversionPipe.transform(1000, 'temperature-fetch')).toBe(
        '1832.0'
      )
    })
  })
})
