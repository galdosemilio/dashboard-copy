import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
  MatStepperModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonTestingModule } from '@coachcare/common';
import { CcrFormFieldsModule } from '@coachcare/common/components';
import { RegisterClinicPageComponent } from './clinic.component';
import { RegisterClinicInfoPageComponent } from './info/info.component';
import { RegisterClinicPaymentPageComponent } from './payment/payment.component';

describe('RegisterClinicPageComponent', () => {
  let component: RegisterClinicPageComponent;
  let fixture: ComponentFixture<RegisterClinicPageComponent>;

  // global object mock
  window['Stripe'] = (key: string) => ({
    createToken: () => {},
    elements: () => ({
      create: () => ({
        mount: (id: string) => {},
        addEventListener: () => {}
      })
    })
  });

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          CcrFormFieldsModule,
          ReactiveFormsModule,
          FormsModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressBarModule,
          MatSelectModule,
          MatStepperModule,
          RouterTestingModule,
          CommonTestingModule.forRoot()
        ],
        declarations: [
          RegisterClinicPageComponent,
          // TODO mock these
          RegisterClinicInfoPageComponent,
          RegisterClinicPaymentPageComponent
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterClinicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
