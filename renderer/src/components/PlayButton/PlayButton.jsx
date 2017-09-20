import React from 'react';

import player from '../../sound-player';

export default class PlayButton extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    const {bufferData} = this.props;
    player.play(bufferData);
  }

  render() {
    return <button onClick={this.onClick}>Play!!!</button>;
  }
}
