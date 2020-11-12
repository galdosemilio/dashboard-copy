import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DieterComponent } from './dieter.component'

describe('DieterComponent', () => {
  let component: DieterComponent
  let fixture: ComponentFixture<DieterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
