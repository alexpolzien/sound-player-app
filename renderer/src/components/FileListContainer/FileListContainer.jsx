import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {selectFile} from '../../actions/actions';
import FileList from '../FileList/FileList.jsx';

class FileListContainer extends React.Component {
  render() {
    return <FileList {...this.props} />;
  }
}

function mapState(state) {
  return {
    loading: state.files.loading,
    files: state.files.files,
    selectedFile: state.files.selectedFile
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({selectFile}, dispatch);
}

export default connect(mapState, mapDispatch)(FileListContainer);
