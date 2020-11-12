import { inject, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { AppDownloadGuard } from './app-download.guard'

describe('AppDownloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonTestingModule.forRoot()],
      providers: [AppDownloadGuard]
    })
  })

  it('injection', inject([AppDownloadGuard], (guard: AppDownloadGuard) => {
    expect(guard).toBeTruthy()
  }))
})
