var React = require('react-native')
var {
  View,
  Text,
  ActivityIndicatorIOS,
  PropTypes,
  StyleSheet,
  isValidElement,
  createElement,
} = React

var RefreshingIndicator = React.createClass({
  propTypes: {
    activityIndicatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    stylesheet: PropTypes.object,
    pullingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    holdingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    refreshingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    pullingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    holdingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    isTouching: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    isWaitingForRelease: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      activityIndicatorComponent: ActivityIndicatorIOS,
      isTouching: false,
      isRefreshing: false,
      isWaitingForRelease: false,
    }
  },
  renderPrompt() {
    if (this.props.isTouching && this.props.isWaitingForRelease) {
      return this.props.holdingPrompt
    } else if (this.props.isTouching && !this.props.isWaitingForRelease) {
      return this.props.pullingPrompt
    } else {
      if (this.props.isRefreshing) {
        return this.props.refreshingPrompt
      } else {
        return null
      }
    }
  },
  renderDescription(styles) {
    return (
      <Text style={styles.description}>
        {this.renderPrompt()}
      </Text>
    )
  },
  renderActivityIndicator(styles) {
    var activityIndicator
    if (this.props.isTouching && this.props.isWaitingForRelease) {
      activityIndicator = this.props.holdingIndicator
    } else if (this.props.isTouching && !this.props.isWaitingForRelease) {
      activityIndicator = this.props.pullingIndicator
    } else if (this.props.isRefreshing) {
      activityIndicator = this.props.refreshingIndicator || this.props.activityIndicatorComponent
    }

    if (activityIndicator) {
      if (isValidElement(activityIndicator)) return activityIndicator
      // is a component class, not an element
      return createElement(activityIndicator, {style: styles.activityIndicator})
    }

    return null
  },
  render() {
    var styles = Object.assign({}, stylesheet, this.props.stylesheet)

    return (
      <View style={[styles.wrapper]}>
        <View style={[styles.container, styles.loading, styles.content]}>
          <View style={[styles.stack]}>
            {this.renderDescription(styles)}
            {this.renderActivityIndicator(styles)}
          </View>
        </View>
      </View>
    )
  },
})

var stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  stack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  wrapper: {
    height: 60,
  },
  content: {
    marginTop: 10,
    height: 40,
  },
})

module.exports = RefreshingIndicator
