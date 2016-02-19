var React = require('react-native')
var {
  PropTypes,
  StyleSheet,
  View,
  Platform,
  PullToRefreshViewAndroid,
} = React
var ListView = require('./ListView')
var createElementFrom = require('./createElementFrom')
var RefreshingIndicator = require('./RefreshingIndicator')
var scrollToCompat = require('./scrollToCompat')

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
    colors: PropTypes.array,
    progressBackgroundColor: PropTypes.string,
    onRefresh: PropTypes.func.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    waitingForRelease: PropTypes.bool,
    onHold: PropTypes.func,
    onPull: PropTypes.func,
    pullingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    pullingIndicator: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    holdingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    holdingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndicator: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    refreshingIndicatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    ignoreInertialScroll: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
    onScroll: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderRelease: PropTypes.func,
    renderHeaderWrapper: (props, propName, componentName) => {
      if (props[propName]) {
        return new Error('The \'renderHeaderWrapper\' prop is no longer used')
      }
    },
    refreshingIndictatorComponent: (props, propName, componentName) => {
      if (props[propName]) {
        return new Error('The \'refreshingIndictatorComponent\' prop has been renamed to \'refreshingIndicatorComponent\'')
      }
    },
  },
  getDefaultProps() {
    return {
      minPulldownDistance: MIN_PULLDOWN_DISTANCE,
      scrollEventThrottle: SCROLL_EVENT_THROTTLE,
      ignoreInertialScroll: true,
      refreshingIndicatorComponent: RefreshingIndicator,
      pullingPrompt: 'Pull to refresh',
      holdingPrompt: 'Release to refresh',
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
        scrollToCompat(
          this.getScrollResponder(),
          -(this.lastContentInsetTop + REFRESHING_INDICATOR_HEIGHT),
          this.lastContentOffsetX,
          false
        )
      }
    }
  },
  componentDidUpdate(prevProps, prevState) {
    if (Platform.OS === 'ios') {
      if (
        this.isReleaseUpdate(prevProps, prevState, this.props, this.state)
      ) {
        scrollToCompat(
          this.getScrollResponder(),
          -(this.lastContentInsetTop),
          this.lastContentOffsetX,
          false
        )
      }
    }
  },
  handlePullToRefreshViewAndroidRef(swipeRefreshLayout) {
    this.swipeRefreshLayout = swipeRefreshLayout
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y
    this.lastScrollY = scrollY
    this.lastContentInsetTop = e.nativeEvent.contentInset.top
    this.lastContentOffsetX = e.nativeEvent.contentOffset.x

    if (!this.props.isRefreshing) {
      if ((this.isTouching && scrollY < 0) || (!this.isTouching && !this.props.ignoreInertialScroll)) {
        if (scrollY < -this.props.minPulldownDistance) {
          if (!this.isWaitingForRelease()) {
            this.waitingForRelease = true
            this.setState({waitingForRelease: true})
            this.props.onHold()
          }
        } else {
          if (this.isWaitingForRelease()) {
            this.waitingForRelease = false
            this.setState({waitingForRelease: false})
          }
          this.props.onPull()
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
    if (this.isWaitingForRelease()) {
      this.waitingForRelease = false
      this.setState({waitingForRelease: false})
      if (!this.props.isRefreshing) {
        if (this.props.onRefresh) {
          this.props.onRefresh()
        }
      }
    }
    this.props.onPull()
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
    var {
      isRefreshing,
      pullingPrompt,
      holdingPrompt,
      refreshingPrompt,
      refreshDescription,
      pullingIndicator,
      holdingIndicator,
      refreshingIndicator,
    } = this.props
    var refreshingIndicatorProps = {
      isRefreshing,
      pullingIndicator,
      holdingIndicator,
      refreshingIndicator,
      pullingPrompt: pullingPrompt,
      holdingPrompt: holdingPrompt,
      refreshingPrompt: refreshingPrompt || refreshDescription,
      isTouching: this.isTouching,
      isWaitingForRelease: this.isWaitingForRelease(),
    }
    return createElementFrom(this.props.refreshingIndicatorComponent, refreshingIndicatorProps)
  },
  render() {
    if (Platform.OS === 'android') {
      return (
        <PullToRefreshViewAndroid
          ref={this.handlePullToRefreshViewAndroidRef}
          onRefresh={this.props.onRefresh}
          colors={this.props.colors}
          progressBackgroundColor={this.props.progressBackgroundColor}
          style={stylesheet.container}
        >
          <ListView
            {...this.props}
            ref={LISTVIEW_REF}
          />
        </PullToRefreshViewAndroid>
      )
    } else {
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
    }
  },
})

var stylesheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  fillParent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

module.exports = ControlledRefreshableListView
