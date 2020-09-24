import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@coachcare/layout';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthService,
  ConfigService,
  ContextService,
  CookieService,
  EventsService,
  LanguageService,
  LayoutService,
  NotifierService
} from '@coachcare/common/services';
import { APP_CONFIG, APP_ENVIRONMENT } from '@coachcare/common/shared';
import { TranslateModule } from '@ngx-translate/core';
import { Account, ApiService, User } from 'selvera-api';
import {
  AccountFactory,
  ApiFactory,
  UserFactory
} from '../../services/api.services';
import { environment, projectConfig } from '../../tests/index';
import { LayoutComponent } from './layout.component';

class MockAuthService {
  check() {
    return true;
  }
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  @Component({
    selector: 'ccr-layout-base',
    template: ''
  })
  class MockLayoutBaseComponent {
    @Input() isMenuOpened: boolean;
    @Input() isPanelOpened: boolean;
    @Input() isPanelEnabled: boolean;
    @Input() lang: string;
    @Input() translations: any;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [LayoutComponent, MockLayoutBaseComponent],
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
          provide: Account,
          useFactory: AccountFactory,
          deps: [ApiService]
        },
        {
          provide: User,
          useFactory: UserFactory,
          deps: [ApiService]
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        ConfigService,
        ContextService,
        CookieService,
        EventsService,
        LanguageService,
        LayoutService,
        NotifierService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
