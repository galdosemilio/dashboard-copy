import * as moment from 'moment'
import { ApiService } from '../../services/api.service'
import { Account } from '../account/index'

import { LoginResponse } from '../../providers/user/responses'
import { AccSingleResponse } from '../account/responses'
import { Session } from '../session/index'
import { LoginModel, LoginRequest } from './requests'
import { Store } from '@ngrx/store'

/**
 * User authentication and fetching/updating info of authenticated user
 */
class User {
  private loggedIn: boolean
  private lastFetched: moment.Moment | undefined

  private profile: AccSingleResponse | undefined = undefined
  private session: Session

  /**
   * Init Api Service
   */
  public constructor(
    private readonly store: Store<any>,
    private readonly apiService: ApiService,
    private readonly account: Account
  ) {
    this.account = new Account(apiService)
    this.session = new Session(store, apiService, account)
  }

  /**
   * Populate if a user is currently logged-in
   */
  private checkIfCurrentlyLoggedIn(): Promise<boolean> {
    return this.get()
      .then(() => (this.loggedIn = true))
      .catch(() => (this.loggedIn = false))
  }

  /**
   * Return if a user is logged in
   */
  public async isLoggedIn(): Promise<boolean> {
    if (this.loggedIn === undefined) {
      return (this.loggedIn = await this.checkIfCurrentlyLoggedIn())
    } else {
      return this.loggedIn
    }
  }

  /**
   * Login user
   * @param request must implement SessionRequest
   * @returns Promise<LoginResponse>
   */
  public login(request: LoginRequest): Promise<LoginResponse> {
    const credentials = new LoginModel(request)

    return this.session.login(credentials).then((res) => {
      if (res.token) {
        this.apiService.setToken(res.token)
      }
      this.loggedIn = true
      return {
        accountType: parseInt(res.accountType, 10),
        token: res.token || ''
      }
    })
  }

  /**
   * Get profile for authenticated user
   * @returns Promise<AccSingleResponse>
   */
  public get(clearCache?: boolean): Promise<AccSingleResponse> {
    if (
      clearCache !== undefined &&
      !clearCache &&
      this.profile !== undefined &&
      this.lastFetched !== undefined &&
      moment().diff(this.lastFetched, 'hours', true) <= 6
    ) {
      return Promise.resolve(this.profile)
    } else {
      return this.session
        .check()
        .then((res) => this.account.getSingle(res.id))
        .then((profile) => {
          this.apiService.setLocales(profile.preferredLocales)
          this.profile = profile
          this.lastFetched = moment()
          return profile
        })
    }
  }

  /**
   * Logout authenticated user
   * @returns Promise<boolean>
   */
  public logout(): Promise<boolean> {
    return this.session.logout().then(() => {
      this.loggedIn = false
      this.apiService.setToken('')
      this.profile = undefined

      try {
        window.localStorage.removeItem('token')
      } catch (e) {
        // console.log(e)
      }
      return true
    })
  }
}

export { User }
