import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {togglePlayback} from '../../actions/actions';
import {SPACEBAR} from '../../constants';
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
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.togglePlayback();
  }

  _onKeyDown(e) {
    if (e.keyCode === SPACEBAR) {
      e.preventDefault();
      this.props.togglePlayback();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
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
