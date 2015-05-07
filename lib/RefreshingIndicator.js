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
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  },
  getDefaultProps() {
    return {
      activityIndicatorComponent: ActivityIndicatorIOS,
    }
  },
  renderActivityIndicator(style) {
    var activityIndicator = this.props.activityIndicatorComponent

    if (isValidElement(activityIndicator)) {
      return activityIndicator
    } else { // is a component class, not an element
      return createElement(activityIndicator, {style})
    }
  },
  render() {
    var styles = Object.assign({}, stylesheet, this.props.stylesheet)

    return (
      <View style={[styles.container, styles.wrapper]}>
        <View style={[styles.container, styles.loading, styles.content]}>
          <Text style={styles.description}>
            {this.props.description}
          </Text>
          {this.renderActivityIndicator(styles.activityIndicator)}
        </View>
      </View>
    )
  },
})

var stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wrapper: {
    height: 60,
    marginTop: 10,
  },
  content: {
    marginTop: 10,
    height: 60,
  },
})

module.exports = RefreshingIndicator
