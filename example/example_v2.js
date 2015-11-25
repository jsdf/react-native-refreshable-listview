/**
 * it's just a sample code, cannot run directly 
 *
 */


'use strict';

var React = require('react-native');
var RefreshableListView = require("react-native-refreshable-listview");
var Spinner = require('react-native-spinkit');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    NavigatorIOS,
    TextInput
    } = React;

    var MyRefreshingIndicator = React.createClass({
      render() {
        return (
          <View style={indicatorStylesheet.wrapper}>
            <Spinner isVisible={true} size={20} type="Wave" color="#e67e22"/>
          </View>
        )
      },
    });

    var MyRefreshingOnPull = React.createClass({
      render() {
        return (
          <View style={indicatorStylesheet.wrapper}>
            <Text>pull more to refresh</Text>
          </View>
        )
      },
    });

    var MyRefreshingOnHold = React.createClass({
      render() {
        return (
          <View style={indicatorStylesheet.wrapper}>
            <Text>Release to refresh</Text>
          </View>
        )
      },
    });


var listviewReactNative = React.createClass({
    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows([
                {"name" : "A","age":10},
                {"name" : "B","age":10},
                {"name" : "C","age":10},
                {"name" : "D","age":10},
                {"name" : "E","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
                {"name" : "A","age":10},
            ]),
        };
    },
    renderHeaderWrapper(Indicator) {
        return (
            <View>
                {/*  you MUST render the refreshingIndicator (which is passed in as the first argument) */}
                {Indicator}
            </View>
        )
    },
    renderRow: function(rowData, sectionID, rowID){
        return (
            <View style={css.row}>
                <Text style={css.text}>{rowData.name}</Text>
                <Text  style={css.text}>{rowData.age}</Text>
            </View>
        );
    },
    render: function() {
      return (
        <View>
          <View style={css.container}>
              <RefreshableListView
                  refreshingIndictatorComponent ={MyRefreshingIndicator}
                  refreshingOnPullComponent ={MyRefreshingOnPull}
                  refreshingOnHoldComponent ={MyRefreshingOnHold}
                  renderHeaderWrapper={this.renderHeaderWrapper}
                  dataSource ={this.state.dataSource}
                  renderRow ={this.renderRow.bind(this)}
                  loadData ={this.renderRow}
                  minPulldownDistance ={40}
                  minDisplayTime ={2000}
                  />
          </View>
        </View>
      );
    }
});

var indicatorStylesheet = StyleSheet.create({
  wrapper: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign : "center"
  }
})

var css = StyleSheet.create({
    container: {
        marginTop : 35
    },

    row : {
        flexDirection : "row",
        paddingBottom : 10,
        borderBottomWidth : 1,
        borderColor : '#ccc',
        marginBottom : 10
    },
    text : {
        flex : 1
    }
});

AppRegistry.registerComponent('listviewReactNative', () => listviewReactNative);
