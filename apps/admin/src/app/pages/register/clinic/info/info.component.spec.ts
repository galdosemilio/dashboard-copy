import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonTestingModule } from '@coachcare/common';
import { CcrFormFieldsModule } from '@coachcare/common/components';
import { RegisterClinicInfoPageComponent } from './info.component';

describe('RegisterClinicInfoPageComponent', () => {
  // let component: RegisterClinicInfoPageComponent;
  // let fixture: ComponentFixture<RegisterClinicInfoPageComponent>;

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
          MatSelectModule,
          RouterTestingModule,
          CommonTestingModule.forRoot()
        ],
        declarations: [RegisterClinicInfoPageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    // fixture = TestBed.createComponent(RegisterClinicInfoPageComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // TODO create a tester component
    // expect(component).toBeTruthy();
  });
});
