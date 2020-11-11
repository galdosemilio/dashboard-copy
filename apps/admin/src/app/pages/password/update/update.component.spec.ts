import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule
} from '@coachcare/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonTestingModule } from '@coachcare/common'
import { CcrFormFieldsModule } from '@coachcare/common/components'
import { PasswordUpdatePageComponent } from './update.component'

describe('PasswordUpdatePageComponent', () => {
  let component: PasswordUpdatePageComponent
  let fixture: ComponentFixture<PasswordUpdatePageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CcrFormFieldsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        CommonTestingModule.forRoot()
      ],
      declarations: [PasswordUpdatePageComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordUpdatePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
