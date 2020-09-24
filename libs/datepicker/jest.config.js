module.exports = {
  name: 'datepicker',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/datepicker',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
