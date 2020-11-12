import { Injectable } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { get, isEmpty } from 'lodash'
import * as lodash from 'lodash'

import * as momentNs from 'moment-timezone'
const moment = momentNs

@Injectable()
export class FormUtils {
  private _errors = {}

  constructor() {}

  /**
   * Prune empty fields from objects
   */
  static pruneEmpty(obj: any, skipKeys: string[] = []) {
    return (function prune(current) {
      lodash.forOwn(current, function (value, key) {
        if (skipKeys.indexOf(key) > -1) {
          return
        }

        if (
          lodash.isUndefined(value) ||
          lodash.isNull(value) ||
          lodash.isNaN(value) ||
          (lodash.isString(value) && lodash.isEmpty(value)) ||
          (lodash.isObject(value) && lodash.isEmpty(prune(value)))
        ) {
          delete current[key]
        }
      })
      // remove any leftover undefined values from the delete
      // operation on an array
      if (lodash.isArray(current)) {
        lodash.pull(current, undefined)
      }

      return current
    })(lodash.cloneDeep(obj)) // do not modify the original object, create a clone instead
  }

  /**
   * Makes visible the invalid fields of a form
   * @param group Form to mark as touched
   */
  static markAsTouched(group: FormGroup | FormArray): void {
    Object.keys(group.controls).map((field) => {
      const control = group.get(field)
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        FormUtils.markAsTouched(control)
      }
    })
  }

  /**
   * Returns an object with the validation errors
   * @param group Form to mark as touched
   */
  static getErrors(group: FormGroup | FormArray, errors = {}): any {
    Object.assign(errors, group.errors ? group.errors : {})
    Object.keys(group.controls).map((field) => {
      const control = group.get(field) as FormControl
      Object.assign(errors, control.errors ? control.errors : {})
      if (control instanceof FormGroup || control instanceof FormArray) {
        FormUtils.getErrors(control, errors)
      }
    })

    return errors
  }

  /**
   * Resolve the initial date for a form.
   */
  getInitialDate() {
    const initial = moment().set({
      hours: 8,
      minutes: 0,
      seconds: 0
    })

    if (initial.isBefore(moment(), 'minutes')) {
      const day = initial.day()
      const add = day > 0 && day < 5 ? 1 : 6 - day + 2
      initial.add(add, 'day')
    }

    const diff = initial.minutes() % 15

    return initial
      .subtract(diff, 'minutes')
      .add(15, 'minutes')
      .set('seconds', 0)
  }

  /**
   * View utils
   */
  hasErrors(group: FormGroup | FormArray) {
    this._errors = FormUtils.getErrors(group)
    return !isEmpty(this._errors)
  }

  getError(errorCode: string) {
    return get(this._errors, errorCode, null)
  }
}
