import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonTestingModule } from '@coachcare/common';
import { SessionGuard } from './session.guard';

describe('SessionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonTestingModule.forRoot()],
      providers: [SessionGuard]
    });
  });

  it(
    'injection',
    inject([SessionGuard], (guard: SessionGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
