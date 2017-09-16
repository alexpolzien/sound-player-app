import React from 'react';

export default class PlayButton extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    this.props.playSelected();
  }

  render() {
    return <button onClick={this.onClick}>Play!!!</button>;
  }
}
