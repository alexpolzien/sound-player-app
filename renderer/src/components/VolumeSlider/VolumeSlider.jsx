import React from 'react';

import styles from './VolumeSlider.css';

export default class VolumeSlider extends React.Component {
  static trackLength = 100;
  static knobSize = 15;

  constructor() {
    super(...arguments);
    this.isDragging = false;

    this.onMouseDown = this._onMouseDown.bind(this);
    this.onMouseMove = this._onMouseMove.bind(this);
    this.onMouseUp = this._onMouseUp.bind(this);
  }

  _onMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.updatePosition(e.pageX);
  }

  _onMouseMove(e) {
    if (this.isDragging) {
      this.updatePosition(e.clientX);
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
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  updatePosition(mouseX) {
    const containerLeft = this.container.getBoundingClientRect().left;
    let offset = mouseX - this.constructor.knobSize / 2 - containerLeft;
    offset = Math.max(0, offset);
    offset = Math.min(this.constructor.trackLength, offset);
    this.knob.style.left = offset + 'px';
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
