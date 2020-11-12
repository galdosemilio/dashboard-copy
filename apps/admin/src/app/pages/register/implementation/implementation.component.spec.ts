import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RegisterImplementationPageComponent } from './implementation.component'

describe('RegisterImplementationPageComponent', () => {
  let component: RegisterImplementationPageComponent
  let fixture: ComponentFixture<RegisterImplementationPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterImplementationPageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterImplementationPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
