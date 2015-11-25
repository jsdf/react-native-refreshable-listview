var React = require('react-native');
var isPromise = require('is-promise');
var delay = require('./delay');
var ListView = require('./ListView');
var RefreshingIndicator = require('./RefreshingIndicator');
var RefreshingOnHold = require('./RefreshingOnHold');
var ControlledRefreshableListView = require('./ControlledRefreshableListView');

var {
  PropTypes,
} = React;

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
    // tony added
    onRefresh: PropTypes.func.isRequired,
    handleRefreshOnHold: PropTypes.func.isRequired,
    destroyRefreshOnHold: PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
      refreshingOnHoldComponent: RefreshingOnHold,
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
          this.setState({isRefreshing: false});
        })
    })
    this.setState({waitingForRelease: false});
  },
  handleRefreshOnHold() {
    this.setState({waitingForRelease: true});
  },
  destroyRefreshOnHold() {
    this.setState({waitingForRelease: false});
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
        isRefreshing={this.state.isRefreshing}
        waitingForRelease={this.state.waitingForRelease}
        onRefresh={this.handleRefresh}
        handleRefreshOnHold={this.handleRefreshOnHold}
        destroyRefreshOnHold={this.destroyRefreshOnHold}
      />
    )
  },
})

RefreshableListView.DataSource = ListView.DataSource
RefreshableListView.RefreshingIndicator = RefreshingIndicator
RefreshableListView.RefreshingOnHold = RefreshingOnHold

module.exports = RefreshableListView
