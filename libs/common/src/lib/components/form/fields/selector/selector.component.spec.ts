import { Component, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@coachcare/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SelectorFormFieldComponent } from './selector.component';

describe('Form.SelectorFormFieldComponent', () => {
  // testing input parameters with a host component
  @Component({
    selector: `ccr-test-host-component`,
    template: `
      <form [formGroup]="form">
        <ccr-form-selector
          formControlName="test"
          [type]="type"
        ></ccr-form-selector>
      </form>
    `
  })
  class TestHostComponent implements OnInit {
    form: FormGroup;
    type: string;

    constructor(private builder: FormBuilder) {}

    ngOnInit() {
      this.form = this.builder.group({
        test: null
      });
    }
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [TestHostComponent, SelectorFormFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.type = 'gender';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
