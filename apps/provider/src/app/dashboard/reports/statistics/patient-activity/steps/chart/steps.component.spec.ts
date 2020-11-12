import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StepsChartComponent } from './steps.component'

describe('StepsChartComponent', () => {
  let component: StepsChartComponent
  let fixture: ComponentFixture<StepsChartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepsChartComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StepsChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
