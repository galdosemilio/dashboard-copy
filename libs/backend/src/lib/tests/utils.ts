/**
 * Jasmine Utils
 */

import { DoneFn } from 'jasmine-core';

/**
 * Handle generic errors
 * @param done Jasmine DoneFn
 * @param expValue Expected value
 */
export function handleError(done: DoneFn, expValue?: string | Array<string>) {
  return (err: string) => {
    if (expValue) {
      switch (typeof expValue) {
        case 'string':
          if (err !== expValue) {
            done.fail(err);
          }
          break;
        case 'object':
          if (expValue.indexOf(err) === -1) {
            done.fail(err);
          }
          break;
        default:
          done.fail(err);
      }
      done();
    } else {
      done.fail(err);
    }
  };
}

/**
 * The request (or process) must fail
 * @param done Jasmine DoneFn
 * @param message Optional message
 */
export function mustFail(done: DoneFn, message?: string) {
  return () => {
    done.fail(message || 'This request must fail');
  };
}

/**
 * The request (or process) must be true
 * @param done Jasmine DoneFn
 */
export function mustBeTrue(done: DoneFn) {
  return (value: boolean) => {
    if (value === true) {
      done();
    } else {
      done.fail();
    }
  };
}
