import { inject, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { RouteWildcardGuard } from './route-wildcard.guard'

describe('RouteWildcardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonTestingModule.forRoot()],
      providers: [RouteWildcardGuard]
    })
  })

  it('injection', inject([RouteWildcardGuard], (guard: RouteWildcardGuard) => {
    expect(guard).toBeTruthy()
  }))
})
