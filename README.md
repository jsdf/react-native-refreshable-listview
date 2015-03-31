# React Native Refreshable ListView
A pull-to-refresh ListView which shows a loading spinner while your data reloads

In action (from [ReactNativeHackerNews](https://github.com/jsdf/ReactNativeHackerNews)):

![React Native Hacker News](http://i.imgur.com/gVmrxDe.png)

### example

var React = require('react-native')
var {Text, View, ListView} = React

var ArticleStore = require('../stores/ArticleStore')
var StoreWatchMixin = require('./StoreWatchMixin')
var ArticleView = require('./ArticleView')
var RefreshableListView = require('./RefreshableListView')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})

var ArticlesScreen = React.createClass({
  mixins: [StoreWatchMixin],
  getInitialState() {
    return {dataSource: ds.cloneWithRows(ArticleStore.all())}
  },
  getStoreWatches() {
    this.watchStore(ArticleStore, () => {
      this.setState({dataSource: ds.cloneWithRows(ArticleStore.all())})
    })
  },
  reloadArticles() {
    return ArticleStore.reload() // returns a promise of reload completion
  },
  renderArticle(article) {
    return <ArticleView article={article} />
  },
  render() {
    // important props
    // - loadData: a function returning a promise, invoked upon pulldown. 
    //   spinner will show until the promise resolves
    // - refreshDescription: text/content to show alongside spinner
    return (
      <RefreshableListView
        dataSource={this.state.dataSource}
        renderRow={this.renderArticle}
        loadData={this.reloadArticles}
        refreshDescription="Refreshing articles"
      />
    )
  }
})
