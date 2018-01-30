import React from 'react';

import styles from './ProgressBar.css';

export default class ProgressBar extends React.Component {
  render() {
    const {
      barColor,
      borderColor,
      borderWidth,
      height,
      progress,
      radius,
      width} = this.props;

    const containerStyle = {
      borderColor,
      borderStyle: 'solid',
      borderWidth,
      borderRadius: radius,
      height,
      overflow: 'hidden',
      position: 'relative',
      width
    }

    const innerWidth = width * progress;
    const innerStyle = {
      backgroundColor: barColor,
      width: innerWidth
    };

    return (
      <div style={containerStyle}>
        <div className={styles.innerBar} style={innerStyle}></div>
      </div>
    );
  }
}
