import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PatientStatsComponent } from './patient-stats.component'

describe('PatientStatsComponent', () => {
  let component: PatientStatsComponent
  let fixture: ComponentFixture<PatientStatsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientStatsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStatsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
