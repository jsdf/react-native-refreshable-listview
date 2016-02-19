var React = require.requireActual('react/dist/react-with-addons')

function makeMockComponentClass(displayName) {
  return React.createClass({
    displayName,
    render() {
      return this.props.children
    },
  })
}

var ReactNative = {
  ...React,
  ActivityIndicatorIOS: makeMockComponentClass('ActivityIndicatorIOS'),
  ListView: makeMockComponentClass('ListView'),
  View: makeMockComponentClass('View'),
  Text: makeMockComponentClass('Text'),
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
}

module.exports = ReactNative
