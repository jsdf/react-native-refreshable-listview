var React = require('react/addons')

function shallowRender(element) {
  var {TestUtils} = React.addons
  var shallowRenderer = TestUtils.createRenderer()

  // add a method to expose instantiated component
  shallowRenderer.getComponent = () => shallowRenderer._instance._instance

  shallowRenderer.render(element)
  return shallowRenderer
}

module.exports = shallowRender
