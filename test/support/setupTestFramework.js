let fs = require('fs')
let sourceMapSupport = require('source-map-support')
let absolutePath = require('absolute-path')
let sourceMapPath = require('./sourceMapPath')

sourceMapSupport.install({
  retrieveSourceMap: (srcpath) => {
    if (srcpath.indexOf("node_modules") > -1) return
    if (!absolutePath(srcpath)) return

    try {
      let map = fs.readFileSync(sourceMapPath(srcpath), 'utf8')
      if (map) return {map} 
    } catch (err) {
      console.error(err.code + ' when loading sourcemap for ' + srcpath)
    }
  }
})

jasmine.getEnv().beforeEach(function() {
  this.shallowRender = require('./shallowRender')

  this.addMatchers(require('jasmine-object-matchers-jest')['1.3'])

  this.addMatchers({
    toBeObject() {
      return this.actual && typeof this.actual == 'object'
    },
    toBeFunction() {
      return typeof this.actual == 'function'
    },
    toBeReactElement() {
      return this.actual && typeof this.actual == 'object' && this.actual._isReactElement
    },
  })
})
