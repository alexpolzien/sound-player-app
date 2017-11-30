import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import styles from './ResultsList.css';

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

class ResultsListItem extends React.Component {
  render() {
    const {file} = this.props;
    return (
      <tr>
        <td className={styles.fileNameCell}>{file.fileName}</td>
        <td className={styles.otherCell}>{file.sampleRate}</td>
        <td className={styles.otherCell}>TODO: num channels</td>
        <td className={styles.otherCell}>TODO: format</td>
      </tr>
    );
  }
}

class ResultsListHeader extends React.Component {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.fileNameCell}>File Name</div>
        <div className={styles.otherCell}>Sample Rate</div>
        <div className={styles.otherCell}>Channels</div>
        <div className={styles.otherCell}>Format</div>
      </div>
    );
  }
}

class ResultsListTable extends React.Component {
  render() {
    const {files} = this.props;

    return (
      <div className={styles.resultsTableContainer}>
        <table className={styles.resultsTable}>
          <tbody>
            {files.map(file => <ResultsListItem key={file.id} file={file} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

class ResultsListMain extends React.Component {
  render() {
    const {files} = this.props;

    return (
      <div className={styles.list}>
        <ResultsListHeader />
        <ResultsListTable files={files} />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ResultsListMain);
