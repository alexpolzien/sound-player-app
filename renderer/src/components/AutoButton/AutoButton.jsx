import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {toggleAutoPlay} from '../../actions/actions';
import styles from './AutoButton.css';

function mapState(state) {
  return {
    autoPlay: state.playback.autoPlay
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({toggleAutoPlay}, dispatch);
}

class AutoButtonMain extends React.Component {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    e.preventDefault();
    this.props.toggleAutoPlay();
  };

  render() {
    const className = this.props.autoPlay ? styles.buttonActive : styles.button;
    return <button className={className} onClick={this.onClick}>AUTO</button>;
  }
}

export default connect(mapState, mapDispatch)(AutoButtonMain);
