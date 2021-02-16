import { GestureService } from './gesture.service'
import { sleep } from '@app/shared/utils'

let gestureService = new GestureService()

describe('Gesture Service Tests', () => {
  beforeEach(() => {
    gestureService = new GestureService()
    gestureService.init({ userIdleTimeout: 100 })
  })

  it('Should mark the user as active right away', () => {
    expect(gestureService.userIdle$.getValue()).toEqual(false)
  })

  it('Should mark the user as idle if 15 minutes pass without any interaction', async () => {
    await sleep(200)
    expect(gestureService.userIdle$.getValue()).toEqual(true)
  })

  it('Should mark the user as idle then mark it as active after an interaction was performed', async () => {
    await sleep(200)
    expect(gestureService.userIdle$.getValue()).toEqual(true)

    document.body.click()

    await sleep(350)
    expect(gestureService.userIdle$.getValue()).toEqual(false)
  })
})
