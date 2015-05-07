jest.dontMock('../ControlledRefreshableListView')

describe('ControlledRefreshableListView', function() {
  let React
  let ControlledRefreshableListView
  let ListView
  let RefreshingIndicator
  let onRefresh
  let description
  let makeScrollEvent

  beforeEach(function() {
    React = require.requireActual('react/addons')

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
    let renderer = this.shallowRender(
      <ControlledRefreshableListView
        isRefreshing={false}
        onRefresh={onRefresh}
      />
    )
    let component = renderer.getComponent()
    let expectedChildProps = {onScroll: component.handleScroll}

    expect(onRefresh).not.toBeCalled()

    let firstRender = renderer.getRenderOutput()
    expect(firstRender.type).toBe(ListView)
    expect(firstRender.props).toContainValues(expectedChildProps)

    // simulate scroll
    component.handleScroll(makeScrollEvent())
    expect(onRefresh).toBeCalled()
  })

  iit('renders indicator in header when refreshing', function() {
    let renderer = this.shallowRender(
      <ControlledRefreshableListView
        onRefresh={onRefresh}
        isRefreshing={true}
        refreshDescription={description}
      />
    )
    let component = renderer.getComponent()

    let expectedChildProps = {
      onScroll: component.handleScroll,
      renderHeader: component.renderHeader,
    }

    let firstRender = renderer.getRenderOutput()
    expect(firstRender.type).toBe(ListView)
    expect(firstRender.props).toContainValues(expectedChildProps)

    let headerElement = component.renderHeader()
    expect(headerElement).toBeReactElement()
    expect(headerElement.type).toBe(RefreshingIndicator)
    expect(headerElement.props).toContainValues({description})
  })

  it('does not render indicator when not refreshing', function() {
    let renderer = this.shallowRender(
      <ControlledRefreshableListView
        onRefresh={onRefresh}
        isRefreshing={false}
      />
    )

    let expectedChildProps = {
      onScroll: component.handleScroll,
      renderHeader: component.renderHeader,
    }

    let firstRender = renderer.getRenderOutput()
    expect(firstRender.type).toBe(ListView)
    expect(firstRender.props).toContainValues(expectedChildProps)

    let headerElement = component.renderHeader()
    expect(headerElement).toBeNull()
  })
})
