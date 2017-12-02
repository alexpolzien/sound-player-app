import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setVolume} from '../../actions/actions';
import {throttle} from '../../utils/event-processing';
import styles from './VolumeSlider.css';

function mapState(state) {
  return {
    level: state.playback.volume
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({setVolume}, dispatch);
}

// TODO: make right side darker
class VolumeSliderMain extends React.Component {
  static trackLength = 100;
  static knobSize = 15;

  constructor() {
    super(...arguments);
    this.isDragging = false;

    this.setVolume = throttle(50, this._setVolume.bind(this));
    this.onMouseDown = this._onMouseDown.bind(this);
    this.onMouseMove = this._onMouseMove.bind(this);
    this.onMouseUp = this._onMouseUp.bind(this);
  }

  _onMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.updatePositionFromMouse(e.pageX);
  }

  _onMouseMove(e) {
    if (this.isDragging) {
      this.updatePositionFromMouse(e.clientX);
    }
  }

  _onMouseUp(e) {
    this.isDragging = false;
  }

  _onMouseUp(e) {
    this.isDragging = false;
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.updatePositionFromPropsChange(this.props.level);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.level !== this.props.level && !this.dragging) {
      this.updatePositionFromPropsChange(nextProps.level);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  _setVolume(level) {
    this.props.setVolume(level);
  }

  updatePositionFromMouse(mouseX) {
    const containerLeft = this.container.getBoundingClientRect().left;
    let offset = mouseX - this.constructor.knobSize / 2 - containerLeft;
    offset = Math.max(0, offset);
    offset = Math.min(this.constructor.trackLength, offset);
    this.knob.style.left = offset + 'px';
    this.setVolume(offset / this.constructor.trackLength);
  }

  updatePositionFromPropsChange(value) {
    this.knob.style.left = (this.props.level * this.constructor.trackLength) + 'px';
  }

  render() {
    return (
      <div className={styles.container}
        ref={container => {this.container = container;}}>
        <div className={styles.track}></div>
        <div className={styles.knob}
          onMouseDown={this.onMouseDown} ref={knob => {this.knob = knob;}}>
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(VolumeSliderMain);
