import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CoachScheduleComponent } from './schedule.component'

describe('CoachScheduleComponent', () => {
  let component: CoachScheduleComponent
  let fixture: ComponentFixture<CoachScheduleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachScheduleComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachScheduleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
