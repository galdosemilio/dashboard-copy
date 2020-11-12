import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DieterFormComponent } from './dieter.component'

describe('DieterFormComponent', () => {
  let component: DieterFormComponent
  let fixture: ComponentFixture<DieterFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
