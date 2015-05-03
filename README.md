# React Native RefreshableListView
A pull-to-refresh ListView which shows a loading spinner while your data reloads

In action (from [ReactNativeHackerNews](https://github.com/jsdf/ReactNativeHackerNews)):

![React Native Hacker News](http://i.imgur.com/gVmrxDe.png)

## usage

### RefreshableListView
#### props

- `loadData: func.isRequired`
  A function returning a Promise or taking a callback, invoked upon pulldown. 
  The refreshing indicator (spinner) will show until the promise resolves or the callback 
  is called.
- `refreshDescription: oneOfType([string, element])`
  Text/element to show alongside spinner. If a custom 
  `refreshingIndictatorComponent` is used this value will be passed as its 
  `description` prop.
- `refreshingIndictatorComponent: oneOfType([func, element])`
  Content to show in list header when refreshing. Can be a component class or 
  instantiated element. Defaults to `RefreshableListView.RefreshingIndicator`.
  You can easily customise the appearance of the indicator by passing in a
  customised `<RefreshableListView.RefreshingIndicator />`, or provide your own
  entirely custom content to be displayed.
- `minDisplayTime: number`
  Minimum time the spinner will show for.
- `minBetweenTime: number`
  Minimum time after a refresh before another refresh can be performed.
- `minPulldownDistance: number`
  Minimum distance (in px) which the list has to be scrolled off the top to 
  trigger a refresh.
- `onScroll: func`
  An event handler for the `onScroll` event which will be chained after the one
  defined by the `RefreshableListView`.
- `renderHeader: func`
  A function to render content in the header, which will always be rendered 
  (regardless of 'refreshing' status) 

### RefreshableListView.RefreshingIndicator
#### props

- `description: oneOfType([string, element])`
  Text/element to show alongside spinner.
- `stylesheet: object`
  A stylesheet object which overrides one or more of the styles defined in the 
  [RefreshingIndicator stylesheet](lib/RefreshingIndicator.js).
- `activityIndicatorComponent: oneOfType([func, element])`
  The spinner to display. Defaults to `<ActivityIndicatorIOS />`.

### example

```js
var React = require('react-native')
var {Text, View, ListView} = React
var RefreshableListView = require('react-native-refreshable-listview')

var ArticleStore = require('../stores/ArticleStore')
var StoreWatchMixin = require('./StoreWatchMixin')
var ArticleView = require('./ArticleView')

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
```

### changelog

- **0.3.0** added some new props, fixed bug where refresh could happen twice
