import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StatDiffComponent } from './stat-diff.component'

describe('StatDiffComponent', () => {
  let component: StatDiffComponent
  let fixture: ComponentFixture<StatDiffComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatDiffComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StatDiffComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
