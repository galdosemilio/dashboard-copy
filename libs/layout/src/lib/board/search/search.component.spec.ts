import { Component, Input } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatAutocompleteModule,
  MatDialogModule,
  MatSnackBarModule
} from '@coachcare/material'
import { RouterTestingModule } from '@angular/router/testing'
import {
  AuthService,
  ConfigService,
  ContextService,
  CookieService,
  EventsService,
  LanguageService,
  NotifierService
} from '@coachcare/common/services'
import { APP_CONFIG, APP_ENVIRONMENT } from '@coachcare/common/shared'
import { TranslateModule } from '@ngx-translate/core'
import { Account, ApiService, User } from 'selvera-api'
import {
  AccountFactory,
  ApiFactory,
  UserFactory
} from '../../../services/api.services'
import { environment, projectConfig } from '../../../tests/index'
import { SearchComponent } from './search.component'

class MockAuthService {
  check() {
    return true
  }
}
@Component({
  selector: 'ccr-icon-search',
  template: ''
})
class MockIconSearchComponent {
  @Input() fill: string
  @Input() size: any
  @Input() stroke: any
}
describe('Layout.SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatDialogModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [SearchComponent, MockIconSearchComponent],
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
        CookieService,
        ConfigService,
        ContextService,
        EventsService,
        LanguageService,
        NotifierService
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
