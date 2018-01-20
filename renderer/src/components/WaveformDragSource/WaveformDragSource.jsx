import {ipcRenderer} from 'electron';
import React from 'react';
import {connect} from 'react-redux';

import styles from './WaveformDragSource.css';

function mapState(state) {
  return {file: state.audioBuffer.file};
}

class WaveformDragSourceMain extends React.Component {
  constructor() {
    super(...arguments);
    this.onDragStart = this._onDragStart.bind(this);
  }

  _onDragStart(e) {
    e.preventDefault();
    const file = this.props.file;
    if (file) {
      ipcRenderer.send('ondragstart', file.path);
    }
  }

  render() {
    return (
      <div className={styles.dragSource} draggable="true"
        onDragStart={this.onDragStart}>
      </div>
    );
  }
}

export default connect(mapState, null)(WaveformDragSourceMain);
