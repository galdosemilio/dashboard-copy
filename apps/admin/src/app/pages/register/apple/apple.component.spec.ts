import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RegisterApplePageComponent } from './apple.component'

describe('RegisterApplePageComponent', () => {
  let component: RegisterApplePageComponent
  let fixture: ComponentFixture<RegisterApplePageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterApplePageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterApplePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
