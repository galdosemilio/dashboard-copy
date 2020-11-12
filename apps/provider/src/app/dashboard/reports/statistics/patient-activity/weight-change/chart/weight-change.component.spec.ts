import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WeightChangeChartComponent } from './weight-change.component'

describe('WeightChangeChartComponent', () => {
  let component: WeightChangeChartComponent
  let fixture: ComponentFixture<WeightChangeChartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeightChangeChartComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightChangeChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
