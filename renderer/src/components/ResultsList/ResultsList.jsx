import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import styles from './ResultsList.css';
import {throttle} from '../../utils/event-processing';

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
  constructor() {
    super(...arguments);
    this.state = {
      scrollPosition: 0,
      scrollHeight: 0
    };
    this.onScroll = this._onScroll.bind(this);
    this.onResize = this._onResize.bind(this);

    const throttleTime = 100; // TODO: make class property
    this.updateScrollPosition = throttle(throttleTime, this._updateScrollPosition.bind(this));
    this.updateHeight = throttle(throttleTime, this._updateHeight.bind(this));
  }

  _onScroll(e) {
    this.updateScrollPosition(e.target.scrollTop);
  }

  _onResize(e) {
    if (this.container) {
      this.updateHeight(this.container.offsetHeight);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  _updateScrollPosition(position) {
    console.log('update scroll position', position);
    this.setState({scrollPosition: position});
  }

  _updateHeight(height) {
    console.log('update height', height);
    this.setState({scrollHeight: height});
  }

  render() {
    const {files} = this.props;

    return (
      <div className={styles.resultsTableContainer}
          onScroll={this.onScroll}
          ref={div => { this.container = div; }}>
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
