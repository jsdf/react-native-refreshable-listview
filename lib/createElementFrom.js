var React = require('react-native')
var {
  cloneElement,
  createElement,
  isValidElement,
} = React

function createElementFrom(elementOrClass, props) {
  if (isValidElement(elementOrClass)) {
    return cloneElement(elementOrClass, props)
  } else { // is a component class, not an element
    return createElement(elementOrClass, props)
  }
}

module.exports = createElementFrom
