import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterMessagesComponent } from './messages.component';

describe('DieterMessagesComponent', () => {
  let component: DieterMessagesComponent;
  let fixture: ComponentFixture<DieterMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterMessagesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
