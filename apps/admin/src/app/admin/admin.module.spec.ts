import { AppAdminModule } from './admin.module'

describe('AppAdminModule', () => {
  let adminModule: AppAdminModule

  beforeEach(() => {
    adminModule = new AppAdminModule()
  })

  it('should create an instance', () => {
    expect(adminModule).toBeTruthy()
  })
})
