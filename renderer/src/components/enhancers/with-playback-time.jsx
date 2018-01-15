import React from 'react';
import {connect} from 'react-redux';

import {getPlayer} from '../../sound-player-service/sound-player-service';
import {throttleAnimationFrame} from '../../utils/event-processing';

function mapState(state) {
  return {
    buffer: state.audioBuffer.buffer,
    file: state.audioBuffer.file
  }
}

function withPlaybackTimeEnhancer(Wrapped) {
  return class extends React.Component {
    constructor() {
      super(...arguments);
      this.onPlaybackPositionChanged = throttleAnimationFrame(this._onPlaybackPositionChanged.bind(this));
      this.state = {
        playbackTime: 0
      };
    }

    componentDidMount() {
      const player = getPlayer(); // TODO: pass via context or something else?
      player.addPlaybackPositionListener(this.onPlaybackPositionChanged);
    }

    componentWillUnmount() {
      const player = getPlayer();
      player.removePlaybackPositionListener(this.onPlaybackPositionChanged);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.file !== this.props.file) {
        this.setState({playbackTime: 0});
      }
    }

    _onPlaybackPositionChanged(timeElapsed, file) {
      if (this.props.file && file.id === this.props.file.id) {
        this.setState({playbackTime: timeElapsed});
      }
    }

    render() {
      const {file, buffer} = this.props;
      const {playbackTime} = this.state;

      let totalTime = null;

      if (file && buffer) {
        totalTime = buffer.left.length * 1.0 / buffer.sampleRate;
      }

      return <Wrapped currentTime={playbackTime} totalTime={totalTime} />;
    }
  }
}

export default function withPlaybackTime(Wrapped) {
  return connect(mapState)(withPlaybackTimeEnhancer(Wrapped));
}
