import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedOrgComponent } from './affiliated-org.component';

describe('RelatedOrgComponent', () => {
  let component: AffiliatedOrgComponent;
  let fixture: ComponentFixture<AffiliatedOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatedOrgComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatedOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
