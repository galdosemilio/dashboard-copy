import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LevlChartComponent } from './levl-chart.component'

describe('LevlChartComponent', () => {
  let component: LevlChartComponent
  let fixture: ComponentFixture<LevlChartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LevlChartComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LevlChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
