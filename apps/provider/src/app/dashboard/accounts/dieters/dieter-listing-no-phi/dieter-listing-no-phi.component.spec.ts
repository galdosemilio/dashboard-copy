import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DieterListingNoPhiComponent } from './dieter-listing-no-phi.component'

describe('NoPhiComponent', () => {
  let component: DieterListingNoPhiComponent
  let fixture: ComponentFixture<DieterListingNoPhiComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterListingNoPhiComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterListingNoPhiComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
