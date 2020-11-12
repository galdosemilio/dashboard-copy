import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StatSingleComponent } from './stat-single.component'

describe('StatSingleComponent', () => {
  let component: StatSingleComponent
  let fixture: ComponentFixture<StatSingleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatSingleComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StatSingleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
