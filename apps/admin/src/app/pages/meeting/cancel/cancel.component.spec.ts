import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MatCardModule } from '@coachcare/material'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { MeetingCancelPageComponent } from './cancel.component'

describe('MeetingCancelPageComponent', () => {
  let component: MeetingCancelPageComponent
  let fixture: ComponentFixture<MeetingCancelPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        RouterTestingModule,
        CommonTestingModule.forRoot()
      ],
      declarations: [MeetingCancelPageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCancelPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
