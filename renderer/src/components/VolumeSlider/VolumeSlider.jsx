import React from 'react';

import {throttle} from '../../utils/event-processing';
import {getPlayer} from '../../sound-player-service/sound-player-service';
import styles from './VolumeSlider.css';

// TODO: make right side darker
export default class VolumeSlider extends React.Component {
  static trackLength = 100;
  static knobSize = 15;

  constructor() {
    super(...arguments);
    this.isDragging = false;

    this.setVolume = throttle(50, this._setVolume.bind(this));
    this.onMouseDown = this._onMouseDown.bind(this);
    this.onMouseMove = this._onMouseMove.bind(this);
    this.onMouseUp = this._onMouseUp.bind(this);
    this.onGainChanged = this._onGainChanged.bind(this);
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
    const player = getPlayer();
    this.updatePositionFromGain(player.getGainLevel());
    player.addGainLevelListener(this.onGainChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    const player = getPlayer();
    player.removeGainLevelListener(this.onGainChanged);
  }

  _setVolume(level) {
    const player = getPlayer();
    player.setGainLevel(level);
  }

  updatePositionFromMouse(mouseX) {
    const containerLeft = this.container.getBoundingClientRect().left;
    let offset = mouseX - this.constructor.knobSize / 2 - containerLeft;
    offset = Math.max(0, offset);
    offset = Math.min(this.constructor.trackLength, offset);
    this.knob.style.left = offset + 'px';
    this.setVolume(offset / this.constructor.trackLength);
  }

  updatePositionFromGain(value) {
    this.knob.style.left = (value * this.constructor.trackLength) + 'px';
  }

  _onGainChanged(value) {
    if (!this.dragging) {
      this.updatePositionFromGain(value);
    }
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
