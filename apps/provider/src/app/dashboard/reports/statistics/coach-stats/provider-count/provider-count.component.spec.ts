import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProviderCountComponent } from './provider-count.component'

describe('ProviderCountComponent', () => {
  let component: ProviderCountComponent
  let fixture: ComponentFixture<ProviderCountComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderCountComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
