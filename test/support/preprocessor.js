var fs = require('fs')
var babel = require('babel-core')
var sourceMapPath = require('./sourceMapPath')

module.exports = {
  process: function (src, filename) {
    // Allow the stage to be configured by an environment
    // variable, but use Babel's default stage (2) if
    // no environment variable is specified.
    var stage = process.env.BABEL_JEST_STAGE || 2

    // Ignore all files within node_modules
    // babel files can be .js, .es, .jsx or .es6
    if (filename.indexOf("node_modules") === -1 && babel.canCompile(filename)) {
      var result = babel.transform(src, { filename: filename, stage: stage, sourceMap: true })

      fs.writeFileSync(sourceMapPath(filename), JSON.stringify(result.map))

      return result.code
    } else {
      return src
    }
  }
}
