import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

const filesSelector = state => state.resultsList.files;
const sortedResultsSelector = createSelector(
  filesSelector,
  files => {
    const filesArray = [];
    for (const fileId in files) {
      filesArray.push(files[fileId]);
    }

    filesArray.sort(
      (file1, file2) => {
        if (file1.fileName < file2.fileName) {
          return -1;
        } else if (file1.fileName > file2.fileName) {
          return 1;
        }
        return 0;
      }
    );

    return filesArray;
  }
);

function mapState(state) {
  return {
    files: sortedResultsSelector(state)
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

class ResultsListMain extends React.Component {
  render() {
    const {files} = this.props;

    return (
      <div>
        <ul>
          {files.map(file => <li key={file.fileId}>{file.fileName}</li>)}
        </ul>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ResultsListMain);
