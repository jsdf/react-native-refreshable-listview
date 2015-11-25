var React = require('react-native')
var {
  PropTypes,
} = React
var ListView = require('./ListView')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')
var RefreshingOnPull = require('./RefreshingOnPull')
var RefreshingOnHold = require('./RefreshingOnHold')

const SCROLL_EVENT_THROTTLE = 32
const MIN_PULLDOWN_DISTANCE = 40

const LISTVIEW_REF = 'listview'

var ControlledRefreshableListView = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    refreshingOnPullComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    refreshingOnHoldComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    ignoreInertialScroll: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
    onScroll: PropTypes.func,
    renderHeader: PropTypes.func,
    renderHeaderWrapper: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderRelease: PropTypes.func,
  },
  getInitialState() {
    return {
      waitingForRelease: false,
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!this.props.isRefreshing && nextProps.isRefreshing && this.isTouching) {
      this.waitingForRelease = true
      this.setState({waitingForRelease: true})
    }
  },
  getDefaultProps() {
    return {
      minPulldownDistance: MIN_PULLDOWN_DISTANCE,
      scrollEventThrottle: SCROLL_EVENT_THROTTLE,
      ignoreInertialScroll: true,
      refreshingOnPullComponent: RefreshingOnPull,
      refreshingOnHoldComponent: RefreshingOnHold,
      refreshingIndictatorComponent: RefreshingIndicator,
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    // slowing show out the icons
    if (this.isTouching || (!this.isTouching && !this.props.ignoreInertialScroll)) {
      if (scrollY < -this.props.minPulldownDistance) {
        if (!this.isWaitingForRelease()) {
          this.waitingForRelease = true;
          this.setState({waitingForRelease: true});
          this.props.handleRefreshOnHold();
        }
      }else {
        // holding but not exceed mini distance
        if (this.isWaitingForRelease()) {
          this.waitingForRelease = false;
          this.setState({waitingForRelease: false});
        }
        this.props.destroyRefreshOnHold();
      }
    }

    this.props.onScroll && this.props.onScroll(e)
  },
  handleResponderGrant() {
    this.isTouching = true;
  },
  handleResponderRelease() {
    this.isTouching = false;
    if (this.props.onResponderRelease) {
      this.props.onResponderRelease.apply(null, arguments);
    }
    if (this.isWaitingForRelease()) {
      this.waitingForRelease = false;
      this.setState({waitingForRelease: false});
      if (!this.props.isRefreshing) {
        if (this.props.onRefresh) {
          this.props.onRefresh();
        }
      }
    }
    this.props.destroyRefreshOnHold();
  },
  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  },
  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  },
  renderHeader() {
    var description = this.props.refreshDescription

    var refreshingIndictator;
    var refreshingOnHold;
    var refreshingOnPull;
    if (this.isTouching && this.isWaitingForRelease()) {
      refreshingOnPull = null;
      refreshingOnHold = createElementFrom(this.props.refreshingOnHoldComponent);
    } else if (this.isTouching && !this.isWaitingForRelease()) {
      refreshingOnHold = null;
      refreshingOnPull = createElementFrom(this.props.refreshingOnPullComponent);
    } else {
      if (this.props.isRefreshing) {
        refreshingIndictator = createElementFrom(this.props.refreshingIndictatorComponent, {description});
      }else {
        refreshingIndictator = null;
      }
      refreshingOnPull = null;
      refreshingOnHold = null;
    }

    if (this.props.renderHeaderWrapper) {
      if(this.isTouching && this.isWaitingForRelease()) {
        return this.props.renderHeaderWrapper(refreshingOnHold)
      }else if (this.isTouching && !this.isWaitingForRelease()) {
        return this.props.renderHeaderWrapper(refreshingOnPull)
      }else {
        return this.props.renderHeaderWrapper(refreshingIndictator)
      }
    } else if (this.props.renderHeader) {
      console.warn('renderHeader is deprecated. Use renderHeaderWrapper instead.')
      if(this.isTouching && this.isWaitingForRelease()) {
        return this.props.renderHeaderWrapper(refreshingOnHold)
      }else if (this.isTouching && !this.isWaitingForRelease()) {
        return this.props.renderHeaderWrapper(refreshingOnPull)
      }else {
        return this.props.renderHeaderWrapper(refreshingIndictator)
      }
    } else {
      if(this.isTouching && this.isWaitingForRelease()) {
        return refreshingOnHold
      }else if (this.isTouching && !this.isWaitingForRelease()) {
        return refreshingOnPull
      }else {
        return refreshingIndictator
      }
    }
  },
  isWaitingForRelease() {
    return this.waitingForRelease || this.props.waitingForRelease
  },
  render() {
    return (
      <ListView
        {...this.props}
        ref={LISTVIEW_REF}
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        scrollEventThrottle={this.props.scrollEventThrottle}
        onStartShouldSetResponder={true}
        onResponderGrant={this.handleResponderGrant}
        onResponderRelease={this.handleResponderRelease}
      />
    )
  },
})

ControlledRefreshableListView.DataSource = ListView.DataSource
ControlledRefreshableListView.RefreshingIndicator = RefreshingIndicator
ControlledRefreshableListView.RefreshingOnHold = RefreshingOnHold

module.exports = ControlledRefreshableListView
