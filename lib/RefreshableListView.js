var React = require('react-native')
var {
  ListView,
  PropTypes,
} = React
var isPromise = require('is-promise')
var delay = require('./delay')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')

const SCROLL_EVENT_THROTTLE = 100 // ms

var RefreshableListView = React.createClass({
  propTypes: {
    loadData: PropTypes.func.isRequired,
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
    minPulldownDistance: PropTypes.number,
    onScroll: PropTypes.func,
    renderHeader: PropTypes.func,
  },
  getDefaultProps() {
    return {
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
      refreshingIndictatorComponent: RefreshingIndicator,
    }
  },
  getInitialState() {
    return {
      refresh: false,
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y

    if (scrollY < -this.props.minPulldownDistance) {
      this.refresh()
    }

    this.props.onScroll && this.props.onScroll(e)
  },
  refresh() {
    if (this.willRefresh || this.state.refresh) return

    this.willRefresh = true

    var loadingDataPromise = new Promise((resolve) => {
      var loadDataReturnValue = this.props.loadData(resolve)

      if (isPromise(loadDataReturnValue)) {
        loadingDataPromise = loadDataReturnValue
      }

      Promise.all([
        loadingDataPromise,
        new Promise((resolve) => this.setState({refresh: true}, resolve)),
        delay(this.props.minDisplayTime),
      ])
        .then(() => delay(this.props.minBetweenTime))
        .then(() => {
          this.willRefresh = false
          this.setState({refresh: false})
        })
    })
  },
  getScrollResponder() {
    return this.refs.listview
  },
  setNativeProps(props) {
    this.refs.listview.setNativeProps(props)
  },
  renderRefreshing() {
    return createElementFrom(this.props.refreshingIndictatorComponent)
  },
  renderHeader() {
    var description = this.props.refreshDescription

    var refreshingIndictator = null
    if (this.state.refresh) {
      refreshingIndictator = createElementFrom(this.props.refreshingIndictatorComponent, {description})
    }

    if (this.props.renderHeader) {
      return this.props.renderHeader(refreshingIndictator)
    } else {
      return refreshingIndictator
    }
  },
  render() {
    return (
      <ListView
        {...this.props}
        ref="listview"
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      />
    )
  },
})

RefreshableListView.DataSource = ListView.DataSource
RefreshableListView.RefreshingIndicator = RefreshingIndicator

module.exports = RefreshableListView
