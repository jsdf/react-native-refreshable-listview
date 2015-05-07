let React = require.requireActual('react')

let ReactNative = {
  ...React,
  ActivityIndicatorIOS: jest.genMockFromModule('./View'),
  ListView: jest.genMockFromModule('./View'),
  View: jest.genMockFromModule('./View'),
  Text: jest.genMockFromModule('./View'),
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
  createElement: jest.genMockFn().mockImpl((componentClass, props, ...children) => {
    return {
      _isReactElement: true,
      type: componentClass,
      props: Object.assign({}, props, {children}),
      _originalProps: props,
    }
  }),
}

module.exports = ReactNative
