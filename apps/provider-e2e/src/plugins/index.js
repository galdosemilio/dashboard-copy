const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')
const csvtojson = require('csvtojson')

module.exports = (on) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor)
  on('task', {
    parseCsv(csv) {
      return csvtojson().fromString(csv)
    }
  })
}
