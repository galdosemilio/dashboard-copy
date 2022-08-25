const { getJestProjects } = require('@nrwl/jest')

module.exports = {
  testMatch: ['**/+(*.)+(spec).+(ts|js)?(x)'],
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  projects: getJestProjects()
}
