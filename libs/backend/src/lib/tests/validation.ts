import * as t from 'io-ts'
import { reporter } from 'io-ts-reporters'

/**
 * io-ts extension
 */
export function optional<T>(type: t.Type<T>) {
  return t.union([type, t.null, t.undefined])
}

/**
 * Facade to create a utility type
 * @param obj Interface fields definitions
 */
export function createType<T>(obj: { [K in keyof T]: t.Mixed }) {
  return t.type(obj)
}

/**
 * Creates an interface from a specification object
 * @param obj Interface fields definitions
 */
export function createValidator<T>(obj: { [K in keyof T]: t.Mixed }) {
  return t.exact(t.type(obj))
}

/**
 * Wraps a io-ts Validator (combinator) inside a promised tester
 * @param name Interface name
 * @param validator Interface fields definitions
 * @returns A promisified validator with more meaningful errors
 */
export function createTest<T>(name: string, obj: { [K in keyof T]: t.Mixed }) {
  return (value: T) =>
    new Promise<T>((resolve, reject) => {
      const validator = createValidator(obj)
      const result = reporter(validator.decode(value) as any) // FIXME workaround
      if (result.length === 0) {
        resolve(value)
      } else {
        reject(`${name}:\n${result.join('\n')}`)
      }
    })
}

/**
 * Wraps any kind of io-ts Validator (combinator) inside a promised tester
 * @param name Type name
 * @param validator io-ts validator
 * @returns A promisified validator with more meaningful errors
 */
export function createTestFromValidator<T>(name: string, validator: t.Type<T>) {
  return (value: T) =>
    new Promise<T>((resolve, reject) => {
      const result = reporter(validator.decode(value) as any) // FIXME workaround
      if (result.length === 0) {
        resolve(value)
      } else {
        reject(`${name}:\n${result.join('\n')}`)
      }
    })
}

/**
 * Validate a void response, void responses are: {}, true
 * @param value Response value
 * @returns A promisified validator with more meaningful errors
 */
export function voidTest<T>(value: T) {
  return new Promise<T>((resolve, reject) => {
    const validator = t.union([createValidator({}), t.boolean])
    const result = reporter(validator.decode(value) as any) // FIXME workaround
    if (result.length === 0) {
      resolve(value)
    } else {
      reject(`${name}:\n${result.join('\n')}`)
    }
  })
}
