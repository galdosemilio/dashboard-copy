import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'

export const COOKIE_ROLE = 'ccrStatic'
export const COOKIE_LANG = 'ccrStaticLanguage'
export const COOKIE_ORG = 'ccrOrg'
export const COOKIE_CALL_BROWSERS_MODAL = 'ccrCallBrowsersModal'
export const COOKIE_CALL_DEVICES_MODAL = 'ccrCallDevicesModal'
export const COOKIE_ORG_EXP = 30
export const COOKIE_SELVERA_PROVIDER = 'SELVERAprovider'
export const COOKIE_SELVERA_ADMIN = 'SELVERAadmin'
export const STORAGE_HIDE_REGISTER_COMPANY = 'ccrHideRegisterNewCompanyLink'
export const STORAGE_PROVIDER_URL = 'ccrProviderRoute'
export const STORAGE_ADMIN_URL = 'ccrAdminRoute'
export const ECOMMERCE_ACCESS_TOKEN = 'ecommerceAccessToken'
export const ECOMMERCE_REFRESH_TOKEN = 'ecommerceRefreshToken'
export const ECOMMERCE_CART_ID = 'ecommerceGuestCartId'

/**
 * Cookie Service
 */
@Injectable()
export class CookieService {
  private documentIsAccessible: boolean
  private devRegex: RegExp = new RegExp('^http://localhost:4200')

  constructor(
    // The type `Document` may not be used here. Although a fix is on its way,
    // we will go with `any` for now to support Angular 2.4.x projects.
    // Issue: https://github.com/angular/angular/issues/12631
    // Fix: https://github.com/angular/angular/pull/14894
    @Inject(DOCUMENT) private document: any
  ) {
    // To avoid issues with server side prerendering, check if `document` is defined.
    this.documentIsAccessible = document !== undefined
  }

  /**
   * @param name Cookie name
   * @returns
   */
  check(name: string): boolean {
    if (!this.documentIsAccessible) {
      return false
    }

    name = encodeURIComponent(name)

    const regExp: RegExp = this.getCookieRegExp(name)
    const exists: boolean = regExp.test(this.document.cookie)

    return exists
  }

  /**
   * @param name Cookie name
   * @returns
   */
  get(name: string): string {
    if (this.documentIsAccessible && this.check(name)) {
      name = encodeURIComponent(name)

      const regExp: RegExp = this.getCookieRegExp(name)
      const result = regExp.exec(this.document.cookie) as RegExpExecArray

      return decodeURIComponent(result[1])
    } else {
      return ''
    }
  }

  /**
   * @returns
   */
  getAll(): {} {
    if (!this.documentIsAccessible) {
      return {}
    }

    const cookies: any = {}
    const document: any = this.document

    if (document.cookie && document.cookie !== '') {
      const split: Array<string> = document.cookie.split(';')

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < split.length; i += 1) {
        const currentCookie: Array<string> = split[i].split('=')

        currentCookie[0] = currentCookie[0].replace(/^ /, '')
        cookies[decodeURIComponent(currentCookie[0])] = decodeURIComponent(
          currentCookie[1]
        )
      }
    }

    return cookies
  }

  /**
   * @param name    Cookie name
   * @param value   Cookie value
   * @param expires Number of days until the cookies expires or an actual `Date`
   * @param path    Cookie path
   * @param domain  Cookie domain
   * @param secure  Secure flag
   */
  set(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean
  ): void {
    if (!this.documentIsAccessible) {
      return
    }

    let cookieString: string =
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';'

    if (expires) {
      if (typeof expires === 'number') {
        const dateExpires: Date = new Date(
          new Date().getTime() + expires * 1000 * 60 * 60 * 24
        )

        cookieString += 'expires=' + dateExpires.toUTCString() + ';'
      } else {
        cookieString += 'expires=' + expires.toUTCString() + ';'
      }
    }

    if (path) {
      cookieString += 'path=' + path + ';'
    }

    if (domain) {
      cookieString += 'domain=' + domain + ';'
    }

    if (!this.devRegex.test(window.location.href)) {
      cookieString += 'secure;'
      cookieString += 'SameSite=None;'
    }

    this.document.cookie = cookieString
  }

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name: string, path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return
    }

    this.set(name, '', -1, path, domain)
  }

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return
    }

    const cookies: any = this.getAll()

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain)
      }
    }
  }

  /**
   * @param name Cookie name
   * @returns
   */
  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(
      /([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi,
      '\\$1'
    )

    return new RegExp(
      '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)',
      'g'
    )
  }
}
