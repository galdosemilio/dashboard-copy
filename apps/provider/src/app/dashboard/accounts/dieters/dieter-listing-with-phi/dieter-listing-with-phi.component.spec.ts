import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterListingWithPhiComponent } from './dieter-listing-with-phi.component';

describe('NoPhiComponent', () => {
  let component: DieterListingWithPhiComponent;
  let fixture: ComponentFixture<DieterListingWithPhiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterListingWithPhiComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterListingWithPhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
