var React = require.requireActual('react/dist/react-with-addons')

var ReactNative = {
  ...React,
  ActivityIndicatorIOS: jest.genMockFromModule('./View'),
  ListView: jest.genMockFromModule('./View'),
  View: jest.genMockFromModule('./View'),
  Text: jest.genMockFromModule('./View'),
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
}

module.exports = ReactNative
