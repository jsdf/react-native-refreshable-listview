let fs = require('fs')
let sourceMapSupport = require('source-map-support')
let absolutePath = require('absolute-path')
let inspectReactElement = require('inspect-react-element')
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
  let React = require.requireActual('react/dist/react-with-addons')
  this.shallowRender = require('./shallowRender')
  window.printElement = (el) => console.log('\n' + inspectReactElement(el))

  jest.setMock('react-native', require.requireActual('../../lib/__mocks__/react-native'))

  this.addMatchers(require('jasmine-object-matchers-jest')['1.3'])

  this.addMatchers({
    toBeObject() {
      return this.actual && typeof this.actual == 'object'
    },
    toBeFunction() {
      return typeof this.actual == 'function'
    },
    toBeReactElement() {
      return React.isValidElement(this.actual)
    },
    toBeReactElementOfType(type) {
      return (
        React.isValidElement(this.actual) &&
        this.actual.type === type
      )
    },
  })
})
