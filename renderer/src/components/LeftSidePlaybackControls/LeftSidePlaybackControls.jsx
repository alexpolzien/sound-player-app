import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {toggleAutoPlay, toggleCyclePlay} from '../../actions/actions';
import styles from './LeftSidePlaybackControls.css';
import PlaybackControlsToggleButton from '../PlayControlsToggleButton/PlayControlsToggleButton.jsx';

function mapState(state) {
  return {
    autoPlay: state.playback.autoPlay,
    cyclePlay: state.playback.cyclePlay
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({toggleAutoPlay, toggleCyclePlay}, dispatch);
}

class LeftSidePlaybackControlsMain extends React.Component {
  render() {
    const {autoPlay, cyclePlay, toggleAutoPlay, toggleCyclePlay} = this.props;

    return (
      <div className={styles.container}>
        <PlaybackControlsToggleButton isActive={autoPlay} toggleAction={toggleAutoPlay} label="AUTO" />
        <PlaybackControlsToggleButton isActive={cyclePlay} toggleAction={toggleCyclePlay} label="CYCLE" />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LeftSidePlaybackControlsMain);
