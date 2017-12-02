import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

function mapState(state) {
  return {
    file: state.audioBuffer.file,
    buffer: state.audioBuffer.buffer
  };
}

class SoundDisplayMain extends React.Component {
  render() {
    const {file, buffer} = this.props;
    return (
      <div>buffer file: {file ? file.path : 'none loaded'}</div>
    );
  }
}

export default connect(mapState, null)(SoundDisplayMain);
