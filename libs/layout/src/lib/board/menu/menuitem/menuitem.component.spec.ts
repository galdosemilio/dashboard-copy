import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@coachcare/layout';
import { MatListModule } from '@coachcare/layout';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItemComponent } from './menuitem.component';

describe('Layout.MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  @Component({
    selector: 'ccr-badge',
    template: ''
  })
  class MockBadgeComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatListModule,
        TranslateModule,
        RouterTestingModule
      ],
      declarations: [MenuItemComponent, MockBadgeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    component.menuItem = { navName: '', navRoute: '' };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
