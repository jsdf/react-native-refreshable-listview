var React = require.requireActual('react')

var View = jest.genMockFromModule('./View')

var ReactNative = {
  ...React,
  ActivityIndicatorIOS: View,
  ListView: View,
  View: View,
  Text: View,
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
}

module.exports = ReactNative
