var React = require('react-native')
var {
  PropTypes,
} = React
var ListView = require('./ListView')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')

const SCROLL_EVENT_THROTTLE = 32
const MIN_PULLDOWN_DISTANCE = 40

const LISTVIEW_REF = 'listview'

var ControlledRefreshableListView = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    ignoreInertialScroll: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
    onScroll: PropTypes.func,
    renderHeader: PropTypes.func,
    renderHeaderWrapper: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderRelease: PropTypes.func,
  },
  getDefaultProps() {
    return {
      minPulldownDistance: MIN_PULLDOWN_DISTANCE,
      scrollEventThrottle: SCROLL_EVENT_THROTTLE,
      ignoreInertialScroll: true,
      refreshingIndictatorComponent: RefreshingIndicator,
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y

    if (this.isTouching || (!this.isTouching && !this.props.ignoreInertialScroll)) {
      if (scrollY < -this.props.minPulldownDistance) {
        if (!this.props.isRefreshing) {
          if (this.props.onRefresh) {
            this.props.onRefresh()
          }
        }
      }
    }

    this.props.onScroll && this.props.onScroll(e)
  },
  handleResponderGrant() {
    this.isTouching = true
    if (this.props.onResponderGrant) {
      this.props.onResponderGrant.apply(null, arguments)
    }
  },
  handleResponderRelease() {
    this.isTouching = false
    if (this.props.onResponderRelease) {
      this.props.onResponderRelease.apply(null, arguments)
    }
  },
  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  },
  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  },
  renderHeader() {
    var description = this.props.refreshDescription

    var refreshingIndictator
    if (this.props.isRefreshing) {
      refreshingIndictator = createElementFrom(this.props.refreshingIndictatorComponent, {description})
    } else {
      refreshingIndictator = null
    }

    if (this.props.renderHeaderWrapper) {
      return this.props.renderHeaderWrapper(refreshingIndictator)
    } else if (this.props.renderHeader) {
      console.warn('renderHeader is deprecated. Use renderHeaderWrapper instead.')
      return this.props.renderHeader(refreshingIndictator)
    } else {
      return refreshingIndictator
    }
  },
  render() {
    return (
      <ListView
        {...this.props}
        ref={LISTVIEW_REF}
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        scrollEventThrottle={this.props.scrollEventThrottle}
        onResponderGrant={this.handleResponderGrant}
        onResponderRelease={this.handleResponderRelease}
      />
    )
  },
})

ControlledRefreshableListView.DataSource = ListView.DataSource
ControlledRefreshableListView.RefreshingIndicator = RefreshingIndicator

module.exports = ControlledRefreshableListView
