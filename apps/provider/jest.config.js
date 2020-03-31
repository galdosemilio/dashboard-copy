module.exports = {
  name: 'provider',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/provider',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
