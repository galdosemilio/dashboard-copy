import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ReportsControlsComponent } from './controls.component'

describe('ReportsControlsComponent', () => {
  let component: ReportsControlsComponent
  let fixture: ComponentFixture<ReportsControlsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsControlsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsControlsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
