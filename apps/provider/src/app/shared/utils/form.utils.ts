import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  cloneDeep,
  forOwn,
  get,
  isArray,
  isEmpty,
  isNaN,
  isNull,
  isObject,
  isString,
  isUndefined,
  pull
} from 'lodash';
import * as moment from 'moment-timezone';

import { ConfigService } from '@app/service/config.service';

@Injectable()
export class FormUtils {
  constructor(private config: ConfigService) {}

  /**
   * Prune empty fields from objects
   */
  pruneEmpty(obj: any) {
    return (function prune(current) {
      forOwn(current, function (value, key) {
        if (
          isUndefined(value) ||
          isNull(value) ||
          isNaN(value) ||
          (isString(value) && isEmpty(value)) ||
          (isObject(value) && isEmpty(prune(value)))
        ) {
          delete current[key];
        }
      });
      // remove any leftover undefined values from the delete
      // operation on an array
      if (isArray(current)) {
        pull(current, undefined);
      }

      return current;
    })(cloneDeep(obj)); // do not modify the original object, create a clone instead
  }

  /**
   * Makes visible the invalid fields of a form.
   * @param group Form to mark as touched
   */
  markAsTouched(group: FormGroup | FormArray): void {
    Object.keys(group.controls).map((field) => {
      const control = group.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAsTouched(control);
      }
    });
  }

  /**
   * Returns an object with the validation errors.
   * @param group Form to mark as touched
   */
  getErrors(group: FormGroup | FormArray, errors = {}): any {
    Object.assign(errors, group.errors ? group.errors : {});
    Object.keys(group.controls).map((field) => {
      const control = group.get(field);
      Object.assign(errors, control.errors ? control.errors : {});
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.getErrors(control, errors);
      }
    });

    return errors;
  }

  /**
   * Resolve the initial date for a form.
   */
  getInitialDate() {
    const initial = moment().set(this.config.get('default.startTime'));

    if (initial.isBefore(moment(), 'minutes')) {
      const day = initial.day();
      const add = day > 0 && day < 5 ? 1 : 6 - day + 2;
      initial.add(add, 'day');
    }

    const diff = initial.minutes() % 15;

    return initial.subtract(diff, 'minutes').add(15, 'minutes').set('seconds', 0);
  }

  /**
   * View utils.
   */
  private _errors = {};

  hasErrors(group: FormGroup | FormArray) {
    this._errors = this.getErrors(group);
    return !isEmpty(this._errors);
  }

  getError(errorCode: string) {
    return get(this._errors, errorCode, null);
  }
}
