import { AppPagesModule } from './pages.module'

describe('AppPagesModule', () => {
  let pagesModule: AppPagesModule

  beforeEach(() => {
    pagesModule = new AppPagesModule()
  })

  it('should create an instance', () => {
    expect(pagesModule).toBeTruthy()
  })
})
