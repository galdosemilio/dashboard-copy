import { async, TestBed } from '@angular/core/testing'
import { PlainLayoutModule } from './plain-layout.module'

describe('PlainLayoutModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlainLayoutModule]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(PlainLayoutModule).toBeDefined()
  })
})
