import React from 'react';
import {connect} from 'react-redux';

import FileList from '../FileList/FileList.jsx';

class FileListContainer extends React.Component {
  render() {
    return <FileList {...this.props} />;
  }
}

function mapState(state) {
  console.log(state);
  return {
    loading: state.files.loading,
    files: state.files.files
  };
}

function mapDispatch(dispatch) {
  return {};
}

export default connect(mapState, mapDispatch)(FileListContainer);
