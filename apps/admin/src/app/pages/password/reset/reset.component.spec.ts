import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule
} from '@coachcare/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { PasswordResetPageComponent } from './reset.component'

describe('PasswordResetPageComponent', () => {
  let component: PasswordResetPageComponent
  let fixture: ComponentFixture<PasswordResetPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        CommonTestingModule.forRoot()
      ],
      declarations: [PasswordResetPageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
