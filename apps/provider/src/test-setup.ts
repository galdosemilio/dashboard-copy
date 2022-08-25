import 'jest-preset-angular/setup-jest'

const storageMock = () => {
  let storage = {}
  return {
    getItem: (key) => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: (key) => delete storage[key],
    clear: () => (storage = {})
  }
}

Object.defineProperty(window, 'CSS', { value: null })

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    }
  }
})

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
})
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    }
  }
})

Object.defineProperty(window, 'localStorage', { value: storageMock() })
Object.defineProperty(window, 'sessionStorage', { value: storageMock() })

import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing'

getTestBed().resetTestEnvironment()
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
)
