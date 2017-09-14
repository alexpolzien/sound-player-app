import React from 'react';

export default class Clicker extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(event) {
    this.props.incrementCount();
  }

  render() {
    console.log(this.props);
    return (
      <div onClick={this.onClick}>Click me!: {this.props.count}</div>
    );
  }
}
