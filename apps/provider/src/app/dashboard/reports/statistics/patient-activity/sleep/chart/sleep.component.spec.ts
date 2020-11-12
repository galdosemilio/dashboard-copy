import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SleepChartComponent } from './sleep.component'

describe('SleepChartComponent', () => {
  let component: SleepChartComponent
  let fixture: ComponentFixture<SleepChartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SleepChartComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
