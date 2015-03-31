var React = require('react-native')
var {
  ListView,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Text,
} = React

// must be less than ~50px due to ScrollView bug (event only fires once)
// https://github.com/facebook/react-native/pull/452
// TODO: expose as a prop when onScroll works properly
var PULLDOWN_DISTANCE = 40 // pixels

var RefreshableListView = React.createClass({
  getDefaultProps() {
    return {
      activityIndicatorComponent: ActivityIndicatorIOS,
      minDisplayTime: 300,
    }
  },
  getInitialState() {
    return {
      reloading: false,
    }
  },
  handleScroll(e) {
    if (e.nativeEvent.contentOffset.y < -PULLDOWN_DISTANCE) {
      this.reloadData()
    }
    this.props.onScroll && this.props.onScroll(e)
  },
  reloadData() {
    if (this.willReload || this.state.reloading) return

    this.willReload = true

    var loadingDataPromise = new Promise((resolve) => {
      var maybePromise = this.props.loadData(resolve)
      if (maybePromise && typeof maybePromise.then == 'function') {
        loadingDataPromise = maybePromise
      }

      Promise.all([
        loadingDataPromise,
        new Promise((resolve) => this.setState({reloading: true}, resolve)),
        new Promise((resolve) => setTimeout(resolve, this.props.minDisplayTime)),
      ]).then(([data]) => {
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
  render() {
    return (
      <ListView
        {...this.props}
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
      />
    )
  }
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