import React from 'react';

import styles from './WaveformView.css';

class WaveformCanvas extends React.Component {
  render() {
    const {height, width} = this.props;
    return <canvas height={height} width={width}></canvas>;
  }
}

class WaveformChannel extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      height: null,
      width: null
    };
    this.onResize = this._onResize.bind(this);
  }

  _onResize() {
    this.updateDimensions();
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  updateDimensions() {
    this.setState({
      height: this.container.offsetHeight,
      width: this.container.offsetWidth
    });
  }

  render() {
    const {channel} = this.props;
    const {height, width} = this.state;
    const className = channel === 'left' ? styles.leftChannel : styles.rightChannel;

    return (
      <div className={className} ref={container => {this.container = container;}}>
        {height && width ? <WaveformCanvas height={height} width={width} /> : null}
      </div>
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
