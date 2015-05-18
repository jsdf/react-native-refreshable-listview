var React = require('react-native')
var {Text, View, ListView} = React
var RefreshableListView = require('react-native-refreshable-listview')

var Example = React.createClass({
  renderHeaderWrapper(refreshingIndicator) {
    return (
      <View>
        <Text>My custom header</Text>
        {/*  you MUST render the refreshingIndicator (which is passed in as the first argument) */}
        {refreshingIndicator}
      </View>
    )
  },
  render() {
    return (
      <RefreshableListView
        renderHeaderWrapper={this.renderHeaderWrapper}
      />
    )
  }
})