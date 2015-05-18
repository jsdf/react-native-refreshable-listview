var React = require('react-native')
var {
  PropTypes,
} = React
var isPromise = require('is-promise')
var delay = require('./delay')
var ListView = require('./ListView')
var RefreshingIndicator = require('./RefreshingIndicator')
var ControlledRefreshableListView = require('./ControlledRefreshableListView')

const LISTVIEW_REF = 'listview'

var RefreshableListView = React.createClass({
  propTypes: {
    loadData: PropTypes.func.isRequired,
    minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
    // props passed to child
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndictatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    renderHeaderWrapper: PropTypes.func,
  },
  getDefaultProps() {
    return {
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
      refreshingIndictatorComponent: RefreshingIndicator,
    }
  },
  getInitialState() {
    return {
      isRefreshing: false,
    }
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
        onRefresh={this.handleRefresh}
        isRefreshing={this.state.isRefreshing}
      />
    )
  },
})

RefreshableListView.DataSource = ListView.DataSource
RefreshableListView.RefreshingIndicator = RefreshingIndicator

module.exports = RefreshableListView
