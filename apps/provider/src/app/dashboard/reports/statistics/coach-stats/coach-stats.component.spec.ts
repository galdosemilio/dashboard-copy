import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CoachStatsComponent } from './coach-stats.component'

describe('CoachComponent', () => {
  let component: CoachStatsComponent
  let fixture: ComponentFixture<CoachStatsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachStatsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachStatsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
