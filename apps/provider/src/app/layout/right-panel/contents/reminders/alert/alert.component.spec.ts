import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SideAlertsComponent } from './alert.component'

describe('SideAlertsComponent', () => {
  let component: SideAlertsComponent
  let fixture: ComponentFixture<SideAlertsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideAlertsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SideAlertsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
