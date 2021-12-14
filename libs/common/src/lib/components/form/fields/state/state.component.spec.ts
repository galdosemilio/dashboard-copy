import { Component, OnInit } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@coachcare/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { StateFormFieldComponent } from './state.component'

describe('Form.StateSelectComponent', () => {
  // testing input parameters with a host component
  @Component({
    selector: `ccr-test-host-component`,
    template: `
      <form [formGroup]="form">
        <ccr-form-field-state formControlName="test"></ccr-form-field-state>
      </form>
    `
  })
  class TestHostComponent implements OnInit {
    form: FormGroup

    constructor(private builder: FormBuilder) {}

    ngOnInit() {
      this.form = this.builder.group({
        test: null
      })
    }
  }

  let component: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [TestHostComponent, StateFormFieldComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
