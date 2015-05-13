var React = require('react-native')
var {
  PropTypes,
} = React
var ListView = require('./ListView')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')

const SCROLL_EVENT_THROTTLE = 100

const LISTVIEW_REF = 'listview'

var ControlledRefreshableListView = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    onScroll: PropTypes.func,
    renderHeader: PropTypes.func,
  },
  getDefaultProps() {
    return {
      minPulldownDistance: 40,
      refreshingIndictatorComponent: RefreshingIndicator,
    }
  },
  getInitialState() {
    return {
      fingerPressed: false,
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y

    if (this.state.fingerPressed && scrollY < -this.props.minPulldownDistance) {
      if (!this.props.isRefreshing) {
        if (this.props.onRefresh) {
          this.props.onRefresh()
        }
      }
    }

    this.props.onScroll && this.props.onScroll(e)
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
        ref={LISTVIEW_REF}
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        onResponderGrant={() => this.setState({fingerPressed: true})}
        onResponderRelease={() => this.setState({fingerPressed: false})}
      />
    )
  },
})

ControlledRefreshableListView.DataSource = ListView.DataSource
ControlledRefreshableListView.RefreshingIndicator = RefreshingIndicator

module.exports = ControlledRefreshableListView
