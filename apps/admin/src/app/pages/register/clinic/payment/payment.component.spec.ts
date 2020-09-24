import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonTestingModule } from '@coachcare/common';
import { RegisterClinicPaymentPageComponent } from './payment.component';

describe('RegisterClinicPaymentPageComponent', () => {
  let component: RegisterClinicPaymentPageComponent;
  let fixture: ComponentFixture<RegisterClinicPaymentPageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          FormsModule,
          MatDialogModule,
          RouterTestingModule,
          CommonTestingModule.forRoot()
        ],
        declarations: [RegisterClinicPaymentPageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterClinicPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
