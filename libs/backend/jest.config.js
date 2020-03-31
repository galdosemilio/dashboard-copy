module.exports = {
  name: 'backend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/backend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
