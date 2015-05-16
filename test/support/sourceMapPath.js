var fs = require('fs')
var os = require('os')
var path = require('path')
var crypto = require('crypto')

var TMPDIR = path.join(os.tmpdir(), 'react-native-refreshable-listview-jest')
try {
  fs.mkdirSync(TMPDIR)
} catch (err) {
  if (err.code != 'EEXIST') console.error(err)
}

function sourceMapPath(srcpath) {
  return path.join(TMPDIR, crypto.createHash('md5').update(srcpath).digest('hex') + '.map')
}

sourceMapPath.TMPDIR = TMPDIR

module.exports = sourceMapPath
