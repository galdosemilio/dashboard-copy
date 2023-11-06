import * as moment from 'moment-timezone'
import { LocalStorageService } from './local-storage.service'

let localStorageService

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorageService = new LocalStorageService()
  })

  it('Should set and get a value', () => {
    localStorageService.setWithExpiry(
      'test',
      'test',
      moment.duration(1, 'month')
    )
    expect(localStorageService.get('test')).toEqual('test')
  })

  it('Should return null if the value is expired', async () => {
    localStorageService.setWithExpiry('test', 'test', moment.duration(1, 'ms'))
    jest.advanceTimersByTime(1000)
    expect(localStorageService.get('test')).toEqual(null)
  })

  it('Should handle parse errors', () => {
    localStorage.setItem('test', '')
    expect(localStorageService.get('test')).toEqual(null)
  })
})
