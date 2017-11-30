import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {togglePlayback} from '../../actions/actions';
import styles from './PlayButton.css';

function mapState(state) {
  return {
    isPlaying: state.playback.isPlaying
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({togglePlayback}, dispatch);
}

const Triangle = (props) => <div className={styles.triangle}></div>;
const Blocks = (props) => <div className={styles.pauseBlocks}></div>;

class PlayButtonMain extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.togglePlayback();
  }

  render() {
    const {isPlaying} = this.props;

    return (
      <div className={styles.container} onClick={this.onClick}>
        <div className={styles.button}>
          {isPlaying ? <Blocks /> : <Triangle />}
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(PlayButtonMain);
