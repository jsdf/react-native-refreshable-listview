jest.dontMock('../ControlledRefreshableListView')

describe('ControlledRefreshableListView', function() {
  let React
  let renderIntoDocument
  let ControlledRefreshableListView
  let ListView
  let createElement
  let RefreshingIndicator
  let onRefresh
  let description
  let makeScrollEvent

  beforeEach(function() {
    React = require.requireActual('react/addons')
    renderIntoDocument = React.addons.TestUtils.renderIntoDocument

    createElement = require('react-native').createElement
    ControlledRefreshableListView = require('../ControlledRefreshableListView')
    ListView = require('../ListView')
    RefreshingIndicator = require('../RefreshingIndicator')
    onRefresh = jest.genMockFn()
    description = "REFRESHING"
    makeScrollEvent = () => ({
      nativeEvent: {
        contentInset: {top: 64, bottom: 0, left: 0, right: 0},
        contentOffset: {x: 0, y: -120},
      },
    })

  })

  it('triggers onRefresh handler when pulldown occurs', function() {
    let component = renderIntoDocument(
      <ControlledRefreshableListView
        isRefreshing={false}
        onRefresh={onRefresh}
      />
    )

    let expectedChildProps = {onScroll: component.handleScroll}

    expect(onRefresh).not.toBeCalled()

    this.expectCreateElementCall(
      this.last(createElement.mock.calls),
      ListView,
      expectedChildProps
    )

    // simulate scroll
    component.handleScroll(makeScrollEvent())
    expect(onRefresh).toBeCalled()
  })

  it('renders indicator in header when refreshing', function() {
    let component = renderIntoDocument(
      <ControlledRefreshableListView
        onRefresh={onRefresh}
        isRefreshing={true}
        refreshDescription={description}
      />
    )

    let expectedChildProps = {
      onScroll: component.handleScroll,
      renderHeader: component.renderHeader,
    }

    this.expectCreateElementCall(
      this.last(createElement.mock.calls),
      ListView,
      expectedChildProps
    )

    let headerElement = component.renderHeader()
    expect(headerElement).not.toBeNull()

    this.expectCreateElementCall(
      this.last(createElement.mock.calls),
      RefreshingIndicator,
      {description},
    )
  })

  it('does not render indicator when not refreshing', function() {
    let component = renderIntoDocument(
      <ControlledRefreshableListView
        onRefresh={onRefresh}
        isRefreshing={false}
      />
    )

    let expectedChildProps = {
      onScroll: component.handleScroll,
      renderHeader: component.renderHeader,
    }

    this.expectCreateElementCall(
      this.last(createElement.mock.calls),
      ListView,
      expectedChildProps
    )

    let headerElement = component.renderHeader()
    expect(headerElement).toBeNull()
  })
})
