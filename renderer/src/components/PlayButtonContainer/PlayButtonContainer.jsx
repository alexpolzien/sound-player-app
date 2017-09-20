import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import PlayButton from '../PlayButton/PlayButton.jsx';

class PlayButtonContainer extends React.Component {
  render() {
    return <PlayButton {...this.props} />;
  }
}

function mapState(state) {
  const fileId = state.files.selectedFile;
  const data = state.bufferCache[fileId];
  return {
    bufferData: data
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapState, mapDispatch)(PlayButtonContainer);
