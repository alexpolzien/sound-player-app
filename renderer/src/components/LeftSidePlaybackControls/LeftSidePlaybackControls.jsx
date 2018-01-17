import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {toggleAutoPlay} from '../../actions/actions';
import styles from './LeftSidePlaybackControls.css';
import PlaybackControlsToggleButton from '../PlayControlsToggleButton/PlayControlsToggleButton.jsx';

function mapState(state) {
  return {
    autoPlay: state.playback.autoPlay
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({toggleAutoPlay}, dispatch);
}

class LeftSidePlaybackControlsMain extends React.Component {
  render() {
    const {autoPlay, toggleAutoPlay} = this.props;

    return (
      <div className={styles.container}>
        <PlaybackControlsToggleButton isActive={autoPlay} toggleAction={toggleAutoPlay} label="AUTO" />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LeftSidePlaybackControlsMain);
