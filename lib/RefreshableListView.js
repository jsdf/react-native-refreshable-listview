import React, { Component, PropTypes } from "react"
import isPromise from 'is-promise'
import delay from './delay'
import ListView from './ListView'
import RefreshingIndicator from './RefreshingIndicator'
import ControlledRefreshableListView from './ControlledRefreshableListView';

const LISTVIEW_REF = 'listview'

export default class extends Component {
static propTypes = {
    loadData: PropTypes.func.isRequired,
    minDisplayTime: PropTypes.number,
    minBetweenTime: PropTypes.number,
    // props passed to child
    refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    refreshingIndicatorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    minPulldownDistance: PropTypes.number,
    renderHeaderWrapper: PropTypes.func,
  };
        
  static defaultProps = {
      minDisplayTime: 300,
      minBetweenTime: 300,
      minPulldownDistance: 40,
      refreshingIndicatorComponent: RefreshingIndicator,
  };

  static DataSource = ListView.DataSource;
  static RefreshingIndicator = RefreshingIndicator;

  state = {
      isRefreshing: false,
  };

  handlePull() {
    this.setState({waitingForRelease: false})
  }

  handleHold() {
    this.setState({waitingForRelease: true})
  }

  handleRefresh() {
    if (this.willRefresh) return

    this.willRefresh = true

    let loadingDataPromise = new Promise((resolve) => {
      const loadDataReturnValue = this.props.loadData(resolve)

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
  }

  getScrollResponder() {
    return this.refs[LISTVIEW_REF].getScrollResponder()
  }

  setNativeProps(props) {
    this.refs[LISTVIEW_REF].setNativeProps(props)
  }

  render() {
    return (
      <ControlledRefreshableListView
        {...this.props}
        ref={LISTVIEW_REF}
        onPull={this.handlePull.bind(this)}
        onHold={this.handleHold.bind(this)}
        onRefresh={this.handleRefresh.bind(this)}
        isRefreshing={this.state.isRefreshing}
        waitingForRelease={this.state.waitingForRelease}
      />
    )
  }
}
