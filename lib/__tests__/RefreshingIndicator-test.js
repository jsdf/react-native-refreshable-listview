jest.dontMock('../RefreshingIndicator')

describe('RefreshingIndicator', function() {
  let React
  let ReactNative
  let ShallowTestUtils
  let RefreshingIndicator
  let description

  beforeEach(function() {
    React = require.requireActual('react/dist/react-with-addons')
    ReactNative = require('react-native')
    ShallowTestUtils = require('react-shallow-testutils')

    RefreshingIndicator = require('../RefreshingIndicator')

    description = 'REFRESHING'
  })

  it('renders an activity indicator', function() {
    let renderer = this.shallowRender(
      <RefreshingIndicator
        refreshingPrompt={description}
        isRefreshing={true}
      />
    )

    let rootEl = renderer.getRenderOutput()
    expect(rootEl).toBeReactElementOfType(ReactNative.View)

    let textEl = ShallowTestUtils.findWithType(rootEl, ReactNative.Text)
    expect(textEl.props.children).toBe(description)

    let indicatorEl = ShallowTestUtils.findWithType(rootEl, ReactNative.ActivityIndicatorIOS)
    expect(indicatorEl).not.toBeUndefined()
  })
})
