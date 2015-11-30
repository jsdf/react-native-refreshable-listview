var React = require('react-native')
var {
  PropTypes,
  StyleSheet,
  View,
  Platform,
} = React
var ListView = require('./ListView')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')

const SCROLL_EVENT_THROTTLE = 32
const MIN_PULLDOWN_DISTANCE = 40
const REFRESHING_INDICATOR_HEIGHT = 60
const LISTVIEW_REF = 'listview'

/*
 * state transitions:
 *   {isRefreshing: false}
 *   v - show loading spinner
 *   {isRefreshing: true, waitingForRelease: true}
 *   v - reset scroll position, offset scroll top
 *   {isRefreshing: true, waitingForRelease: false}
 *   v - hide loading spinner
 *   {isRefreshing: false}
 */

var ControlledRefreshableListView = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    refreshPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndicatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    ignoreInertialScroll: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
    onScroll: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderRelease: PropTypes.func,
    waitingForRelease: PropTypes.bool,
    renderHeaderWrapper: (props, propName, componentName) => {
      if (props[propName]) {
        return new Error("The 'renderHeaderWrapper' prop is no longer used")
      }
    },
    refreshingIndictatorComponent: (props, propName, componentName) => {
      if (props[propName]) {
        return new Error("The 'refreshingIndictatorComponent' prop has been renamed to 'refreshingIndicatorComponent'")
      }
    },
  },
  getDefaultProps() {
    return {
      minPulldownDistance: MIN_PULLDOWN_DISTANCE,
      scrollEventThrottle: SCROLL_EVENT_THROTTLE,
      ignoreInertialScroll: true,
      refreshingIndicatorComponent: RefreshingIndicator,
    }
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
  componentWillUpdate(nextProps, nextState) {
    if (Platform.OS === 'ios') {
      if (
        this.isReleaseUpdate(this.props, this.state, nextProps, nextState)
      ) {
        this.getScrollResponder().scrollWithoutAnimationTo(
          -(this.lastContentInsetTop + REFRESHING_INDICATOR_HEIGHT),
          this.lastContentOffsetX
        )
      }
    }
  },
  componentDidUpdate(prevProps, prevState) {
    if (Platform.OS === 'ios') {
      if (
        this.isReleaseUpdate(prevProps, prevState, this.props, this.state)
      ) {
        this.getScrollResponder().scrollWithoutAnimationTo(
          -(this.lastContentInsetTop),
          this.lastContentOffsetX
        )
      }
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y
    this.lastScrollY = scrollY
    this.lastContentInsetTop = e.nativeEvent.contentInset.top
    this.lastContentOffsetX = e.nativeEvent.contentOffset.x

    if (this.isTouching || (!this.isTouching && !this.props.ignoreInertialScroll)) {
      if (scrollY < -this.props.minPulldownDistance) {
        !this.props.isRefreshing && (this.needRefresh = true)
      } else if (this.needRefresh) {
        this.needRefresh = false
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
    if (this.isWaitingForRelease()) {
      this.waitingForRelease = false
      this.setState({waitingForRelease: false})
    }
    if (this.needRefresh) {
      this.needRefresh = false
      this.props.onRefresh && this.props.onRefresh()
    }
    if (this.props.onResponderRelease) {
      this.props.onResponderRelease.apply(null, arguments)
    }
  },
  getContentContainerStyle() {
    if (!this.props.isRefreshing || this.isWaitingForRelease()) return null

    return {marginTop: REFRESHING_INDICATOR_HEIGHT}
  },
  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  },
  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  },
  isWaitingForRelease() {
    return this.waitingForRelease || this.props.waitingForRelease
  },
  isReleaseUpdate(oldProps, oldState, newProps, newState) {
    return (
      (!oldProps.isRefreshing && newProps.isRefreshing && !this.waitingForRelease) ||
      (oldProps.isRefreshing && oldState.waitingForRelease && !newState.waitingForRelease)
    )
  },
  renderRefreshingIndicator() {
    var {isRefreshing, refreshDescription, refreshPrompt} = this.props
    var refreshingIndicatorProps = {
      isRefreshing,
      description: refreshDescription,
      prompt: refreshPrompt,
      pulldownDistance: -(this.lastScrollY || 0),
    }
    return createElementFrom(this.props.refreshingIndicatorComponent, refreshingIndicatorProps)
  },
  render() {
    return (
      <View style={[stylesheet.container]}>
        <View style={[stylesheet.fillParent]}>
          {this.renderRefreshingIndicator()}
        </View>
        <View style={[stylesheet.fillParent]}>
          <ListView
            {...this.props}
            ref={LISTVIEW_REF}
            contentContainerStyle={this.getContentContainerStyle()}
            onScroll={this.handleScroll}
            scrollEventThrottle={this.props.scrollEventThrottle}
            onResponderGrant={this.handleResponderGrant}
            onResponderRelease={this.handleResponderRelease}
          />
        </View>
      </View>
    )
  },
})

var stylesheet = StyleSheet.create({
  container: {
    // flex: 1,
  },
  fillParent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // offsetParent: {
  //   position: 'relative',
  // },
  // positionTopLeft: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  // },
  // fill: {
  //   flex: 1
  // },
  // center: {
  //   flex: 1,
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  // },
})

ControlledRefreshableListView.DataSource = ListView.DataSource
ControlledRefreshableListView.RefreshingIndicator = RefreshingIndicator

module.exports = ControlledRefreshableListView
