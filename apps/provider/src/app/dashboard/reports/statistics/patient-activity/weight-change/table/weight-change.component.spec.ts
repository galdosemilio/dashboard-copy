import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { WeightChangeTableComponent } from './weight-change.component'

describe('WeightChangeTableComponent', () => {
  let component: WeightChangeTableComponent
  let fixture: ComponentFixture<WeightChangeTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeightChangeTableComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightChangeTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
