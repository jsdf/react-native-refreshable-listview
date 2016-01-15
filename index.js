'use strict';

// Export RefreshableListView
var RefreshableListView = {
  get DataSource() {
    return require('./lib/ListView').DataSource;
  },
  get RefreshingIndicator() {
    return require('./lib/RefreshingIndicator');
  },
  get ControlledRefreshableListView() {
    return require('./lib/ControlledRefreshableListView');
  },

  ...require('./lib/RefreshableListView'),
};

module.exports = RefreshableListView;
