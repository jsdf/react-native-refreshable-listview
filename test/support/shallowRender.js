let React = require('react/addons')
shallowRender = function(element) {
  let {TestUtils} = React.addons
  let shallowRenderer = TestUtils.createRenderer()

  // add a method to expose instantiated component
  shallowRenderer.getComponent = () => shallowRenderer._instance._instance

  shallowRenderer.render(element)
  return shallowRenderer
}

module.exports = shallowRender
