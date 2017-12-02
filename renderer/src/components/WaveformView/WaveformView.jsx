import React from 'react';

import styles from './WaveformView.css';

class WaveformChannel extends React.Component {
  render() {
    const {channel} = this.props;
    const className = channel === 'left' ? styles.leftChannel : styles.rightChannel;
    return (
      <div className={className}>Channel</div>
    );
  }
}

export default class WaveformView extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <WaveformChannel channel="left"/>
        <WaveformChannel channel="right" />
      </div>
    );
  }
}
