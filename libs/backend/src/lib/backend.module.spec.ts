import { TestBed } from '@angular/core/testing'

import { environment } from '@coachcare/backend/tests'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { BackendModule } from './backend.module'

describe('BackendModule', () => {
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        BackendModule.forRoot(environment)
      ]
    }).compileComponents()
  })

  it('defined', () => {
    expect(BackendModule).toBeDefined()
  })
})
