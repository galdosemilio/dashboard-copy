import { async, TestBed } from '@angular/core/testing'
import { LayoutModule } from './layout.module'

describe('LayoutModule', () => {
  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [LayoutModule]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(LayoutModule).toBeDefined()
  })
})
