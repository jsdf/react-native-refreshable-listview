var TestUtils = require('react-addons-test-utils')

function shallowRender(element) {
  var shallowRenderer = TestUtils.createRenderer()

  // add a method to expose instantiated component
  shallowRenderer.getComponent = () => shallowRenderer._instance._instance

  shallowRenderer.render(element)
  return shallowRenderer
}

module.exports = shallowRender
