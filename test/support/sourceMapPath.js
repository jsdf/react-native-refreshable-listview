var fs = require('fs')
var os = require('os')
var path = require('path')
var crypto = require('crypto')

var TMPDIR = path.join(os.tmpdir(), 'react-native-refreshable-listview-jest')
if (!fs.existsSync(TMPDIR)) fs.mkdirSync(TMPDIR)

function sourceMapPath(srcpath) {
  return path.join(TMPDIR, crypto.createHash('md5').update(srcpath).digest('hex') + '.map')
}

sourceMapPath.TMPDIR = TMPDIR

module.exports = sourceMapPath
