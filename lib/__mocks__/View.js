var React = require.requireActual('react/dist/react-with-addons')

var View = React.createClass({
  render() {
    return this.props.children
  },
})

module.exports = View
