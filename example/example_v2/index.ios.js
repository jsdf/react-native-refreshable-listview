/**
 * pull and refresh
 * react native
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
          <Spinner isVisible={true} size={20} type="Wave" color="#e67e22"/>
        )
      },
    });

    var MyPullingIndicator = React.createClass({
      render() {
        return (
          <Spinner isVisible={true} size={20} type="WanderingCubes" color="#e67e22"/>
        )
      },
    });

    var MyHoldingIndicator = React.createClass({
      render() {
        return (
          <Spinner isVisible={true} size={20} type="Circle" color="#e67e22"/>
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
              style={css.refreshableListView}
              pullingIndicator= {MyPullingIndicator}
              holdingIndicator= {MyHoldingIndicator}
              refreshingIndicator= {MyRefreshingIndicator}
              pullingPrompt= 'pull to refresh'
              holdingPrompt= 'release to refresh'
              refreshingPrompt= 'refreshing'
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    textAlign : "center"
  }
})

var css = StyleSheet.create({

    container: {
      marginTop : 0,
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
