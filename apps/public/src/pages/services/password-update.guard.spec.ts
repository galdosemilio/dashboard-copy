import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonTestingModule } from '@coachcare/common';
import { PasswordUpdateGuard } from './password-update.guard';

describe('PasswordUpdateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonTestingModule.forRoot()],
      providers: [PasswordUpdateGuard]
    });
  });

  it(
    'injection',
    inject([PasswordUpdateGuard], (guard: PasswordUpdateGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
