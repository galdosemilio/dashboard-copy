import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@coachcare/layout';
import { MatToolbarModule } from '@coachcare/layout';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService, EventsService } from '@coachcare/common/services';
import { APP_CONFIG, APP_ENVIRONMENT } from '@coachcare/common/shared';
import { ApiService, Message } from 'selvera-api';
import { ApiFactory, MessageFactory } from '../../../services/api.services';
import { environment, projectConfig } from '../../../tests/index';
import { MenuComponent } from './menu.component';

describe('Layout.MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  @Component({
    selector: 'ccr-search',
    template: ''
  })
  class MockSearchComponent {
    @Input() fill: string;
  }

  @Component({
    selector: 'ccr-menuitem',
    template: ''
  })
  class MockMenuItemComponent {
    @Input() menuItem: any;
    @Input() level = 1;
    @Input() parent: any;
    @Input() isMenuOpened = false;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatToolbarModule, RouterTestingModule],
      declarations: [MenuComponent, MockMenuItemComponent, MockSearchComponent],
      providers: [
        {
          provide: APP_ENVIRONMENT,
          useValue: environment
        },
        {
          provide: APP_CONFIG,
          useValue: projectConfig
        },
        {
          provide: ApiService,
          useFactory: ApiFactory,
          deps: [APP_ENVIRONMENT]
        },
        {
          provide: Message,
          useFactory: MessageFactory,
          deps: [ApiService]
        },
        ConfigService,
        EventsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
