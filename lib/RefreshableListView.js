var React = require('react-native')
var {
  PropTypes,
} = React
var isPromise = require('is-promise')
var delay = require('./delay')
var RefreshingIndicator = require('./RefreshingIndicator')
var ControlledRefreshableListView = require('./ControlledRefreshableListView')

const LISTVIEW_REF = 'listview'

var RefreshableListView = React.createClass({
  propTypes: {
    loadData: PropTypes.func.isRequired,
    minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
    // props passed to child
    refreshPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndicatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
  },
  getDefaultProps() {
    return {
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
      refreshingIndicatorComponent: RefreshingIndicator,
    }
  },
  getInitialState() {
    return {
      isRefreshing: false,
    }
  },
  handlePull() {
    this.setState({waitingForRelease: false})
  },
  handleHold() {
    this.setState({waitingForRelease: true})
  },
  handleRefresh() {
    if (this.willRefresh) return

    this.willRefresh = true

    var loadingDataPromise = new Promise((resolve) => {
      var loadDataReturnValue = this.props.loadData(resolve)

      if (isPromise(loadDataReturnValue)) {
        loadingDataPromise = loadDataReturnValue
      }

      Promise.all([
        loadingDataPromise,
        new Promise((resolve) => this.setState({isRefreshing: true}, resolve)),
        delay(this.props.minDisplayTime),
      ])
        .then(() => delay(this.props.minBetweenTime))
        .then(() => {
          this.willRefresh = false
          this.setState({isRefreshing: false})
        })
    })

    this.setState({waitingForRelease: false})
  },
  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  },
  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  },
  render() {
    return (
      <ControlledRefreshableListView
        {...this.props}
        ref={LISTVIEW_REF}
        onPull={this.handlePull}
        onHold={this.handleHold}
        onRefresh={this.handleRefresh}
        isRefreshing={this.state.isRefreshing}
        waitingForRelease={this.state.waitingForRelease}
      />
    )
  },
})

module.exports = RefreshableListView
