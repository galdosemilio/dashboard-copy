import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { NotFoundPageComponent } from './not-found.component'

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent
  let fixture: ComponentFixture<NotFoundPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonTestingModule.forRoot()],
      declarations: [NotFoundPageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
