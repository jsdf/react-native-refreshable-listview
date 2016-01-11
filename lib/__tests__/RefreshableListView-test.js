jest.dontMock('../RefreshableListView')

describe('RefreshableListView', function() {
  let React
  let merge
  let ControlledRefreshableListView
  let RefreshableListView
  let loadDataResolve
  let loadData

  beforeEach(function() {
    React = require.requireActual('react/dist/react-with-addons')
    merge = require.requireActual('xtend')

    ControlledRefreshableListView = require('../ControlledRefreshableListView')
    RefreshableListView = require('../RefreshableListView')


    loadData = jest.genMockFunction().mockImplementation(() => {
      return new Promise((resolve) => {
        loadDataResolve = resolve
      })
    })
  })

  it('renders refreshing sequence when child view is refreshed', function() {
    let renderer = this.shallowRender(
      <RefreshableListView loadData={loadData} />
    )
    let component = renderer.getComponent()
    let expectedChildProps = {onRefresh: component.handleRefresh}

    let firstRender = renderer.getRenderOutput()
    expect(firstRender.type).toBe(ControlledRefreshableListView)
    expect(firstRender.props).toContainValues(merge(expectedChildProps, {isRefreshing: false}))

    // simulate refresh
    component.handleRefresh()
    jest.runAllTimers()

    let secondRender = renderer.getRenderOutput()
    expect(secondRender.type).toBe(ControlledRefreshableListView)
    expect(secondRender.props).toContainValues(merge(expectedChildProps, {isRefreshing: true}))

    // simulate data reloading completion
    loadDataResolve()
    jest.runAllTimers()

    // TODO

    // let thirdRender = renderer.getRenderOutput()
    // expect(thirdRender.type).toBe(ControlledRefreshableListView)
    // expect(thirdRender.props).toContainValues(merge(expectedChildProps, {isRefreshing: false}))
  })
})
