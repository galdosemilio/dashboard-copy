import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterJournalComponent } from './journal.component';

describe('DieterJournalComponent', () => {
  let component: DieterJournalComponent;
  let fixture: ComponentFixture<DieterJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterJournalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
