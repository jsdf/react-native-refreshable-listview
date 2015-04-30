var React = require('react-native')
var {
  ListView,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
  PropTypes,
} = React
var isPromise = require('is-promise')
var delay = require('./delay')

var RefreshableListView = React.createClass({
  propTypes: {
    onScroll: PropTypes.func,
    loadData: PropTypes.func.isRequired,
    minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
    minPulldownDistance: PropTypes.number,
    activityIndicatorComponent: PropTypes.func,
    stylesheet: PropTypes.object,
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  },
  getDefaultProps() {
    return {
      activityIndicatorComponent: ActivityIndicatorIOS,
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
    }
  },
  getInitialState() {
    return {
      reloading: false,
    }
  },
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y

    if (scrollY < -this.props.minPulldownDistance) {
      this.reloadData()
    }

    this.props.onScroll && this.props.onScroll(e)
  },
  reloadData() {
    if (this.willReload || this.state.reloading) return

    this.willReload = true

    var loadingDataPromise = new Promise((resolve) => {
      var loadDataReturnValue = this.props.loadData(resolve)

      if (isPromise(loadDataReturnValue)) {
        loadingDataPromise = loadDataReturnValue
      }

      Promise.all([
        loadingDataPromise,
        new Promise((resolve) => this.setState({reloading: true}, resolve)),
        delay(this.props.minDisplayTime),
      ])
        .then(() => delay(this.props.minBetweenTime))
        .then(() => {
          this.willReload = false
          this.setState({reloading: false})
        })
    })
  },
  renderHeader() {
    if (this.state.reloading) {
      var styles = Object.assign({}, baseStyles, this.props.stylesheet)
      var ActivityIndicator = this.props.activityIndicatorComponent

      return (
        <View style={[styles.container, styles.wrapper]}>
          <View style={[styles.container, styles.loading]}>
            <Text style={styles.description}>
              {this.props.refreshDescription}
            </Text>
            <ActivityIndicator style={styles.activityIndicator} />
          </View>
        </View>
      )
    } else {
      return null
    }
  },
  getScrollResponder() {
    return this.refs.listview
  },
  setNativeProps(props) {
    this.refs.listview.setNativeProps(props)
  },
  render() {
    return (
      <ListView
        {...this.props}
        ref="listview"
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        scrollEventThrottle={100}
      />
    )
  },
})

var baseStyles = StyleSheet.create({
  wrapper: {
    height: 60,
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loading: {
    height: 60,
  },
})

RefreshableListView.DataSource = ListView.DataSource

module.exports = RefreshableListView
