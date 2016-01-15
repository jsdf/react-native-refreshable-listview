'use strict'

// Export RefreshableListView
var RefreshableListViewDeps = {
  get DataSource() {
    return require('./lib/ListView').DataSource
  },
  get RefreshingIndicator() {
    return require('./lib/RefreshingIndicator')
  },
  get ControlledRefreshableListView() {
    return require('./lib/ControlledRefreshableListView')
  },
}

module.exports = Object.assign(require('./lib/RefreshableListView'), RefreshableListViewDeps)
