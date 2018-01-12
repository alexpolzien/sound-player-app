import React from 'react';
import {connect} from 'react-redux';

import styles from './WaveformView.css';

function mapState(state) {
  return {
    buffer: state.audioBuffer.buffer,
    file: state.audioBuffer.file
  }
}

class WaveformCanvas extends React.Component {
  constructor() {
    super(...arguments);
    this.ctx = null;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.drawWave();
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: right method for this?
    const {height, width, wave} = this.props;

    if (height !== prevProps.height || width !== prevProps.width || wave !== prevProps.wave) {
      this.drawWave();
    }
  }

  drawWave() {
    const {height, width, wave} = this.props;

    if (wave) {
      const numSamples = wave.length;
      this.ctx.fillStyle = 'rgb(160, 196, 255)';
      const halfY = height / 2;

      for (let x = 0; x < width; x++) {
        const wavePosition = Math.round((x / width) * numSamples);
        const waveValue = wave[wavePosition];

        const barHeight = waveValue * halfY;

        // clear this x position
        this.ctx.clearRect(x, 0, 1, height);

        // draw the top bar
        this.ctx.fillRect(x, halfY - barHeight, 1, barHeight);
      }
    }
  }

  render() {
    const {height, width} = this.props;
    return <canvas height={height} width={width} ref={canvas => {this.canvas = canvas;}}></canvas>;
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
    const {channel, wave} = this.props;
    const {height, width} = this.state;
    const className = channel === 'left' ? styles.leftChannel : styles.rightChannel;

    return (
      <div className={className} ref={container => {this.container = container;}}>
        {height && width ? <WaveformCanvas height={height} width={width} wave={wave}/> : null}
      </div>
    );
  }
}

class WaveformViewMain extends React.Component {
  render() {
    const {buffer, file} = this.props;

    let leftWave;
    let rightWave;

    if (buffer) {
      leftWave = buffer.left;
      rightWave = buffer.right;
    }

    return (
      <div className={styles.container}>
        <WaveformChannel channel="left" wave={leftWave} />
        <WaveformChannel channel="right" wave={rightWave} />
      </div>
    );
  }
}

export default connect(mapState, null)(WaveformViewMain);
