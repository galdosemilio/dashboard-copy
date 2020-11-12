import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DieterSettingsComponent } from './settings.component'

describe('DieterSettingsComponent', () => {
  let component: DieterSettingsComponent
  let fixture: ComponentFixture<DieterSettingsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterSettingsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterSettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
