import React from 'react';

import styles from './PlayControlsToggleButton.css';

export default class PlayControlsToggleButton extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.toggleAction();
  }

  render() {
    const {isActive, label} = this.props;
    const className = isActive ? styles.buttonActive : styles.button;
    return <button className={className} onClick={this.onClick}>{label}</button>
  }
}
