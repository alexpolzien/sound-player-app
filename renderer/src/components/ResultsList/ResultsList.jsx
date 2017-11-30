import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import styles from './ResultsList.css';
import {throttleAnimationFrame} from '../../utils/event-processing';

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

class ResultsListItem extends React.PureComponent {
  render() {
    const {file, top} = this.props;
    return (
      <li style={{top: top}}>
        <div className={styles.fileNameCell}>{file.fileName}</div>
        <div className={styles.otherCell}>{file.sampleRate}</div>
        <div className={styles.otherCell}>TODO: num channels</div>
        <div className={styles.otherCell}>TODO: format</div>
      </li>
    );
  }
}

class Header extends React.Component {
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

class ScrollList extends React.PureComponent {
  static paddingPages = 2;
  static rowHeight = 20;
  static throttleTime = 100;

  constructor() {
    super(...arguments);
    this.state = {
      scrollPosition: 0,
      scrollHeight: 0
    };
    this.onScroll = this._onScroll.bind(this);
    this.onResize = this._onResize.bind(this);

    this.updateScrollPosition = throttleAnimationFrame(this._updateScrollPosition.bind(this));
    this.updateHeight = throttleAnimationFrame(this._updateHeight.bind(this));
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
    this.setState({scrollPosition: position});
  }

  _updateHeight(height) {
    this.setState({scrollHeight: height});
  }

  render() {
    const {files} = this.props;
    const totalHeight = files.length * this.constructor.rowHeight;
    const scrollTop = this.container ? this.container.scrollTop : 0;
    const viewportHeight = this.container ? this.container.offsetHeight : 0;

    const rowsInViewport = Math.ceil(viewportHeight / this.constructor.rowHeight);
    const paddingRows = rowsInViewport * this.constructor.paddingPages;
    const topRowsHidden = Math.max(0, Math.floor(scrollTop / this.constructor.rowHeight) - paddingRows);

    const visibleFiles = files.slice(topRowsHidden, topRowsHidden + rowsInViewport + paddingRows * 2);

    return (
      <div className={styles.scrollList}
          onScroll={this.onScroll}
          ref={div => { this.container = div; }}>
          <ul style={{height: totalHeight}}>
            {visibleFiles.map((file, i) => <ResultsListItem key={file.id} file={file} top={(i + topRowsHidden) * this.constructor.rowHeight}/>)}
          </ul>
      </div>
    );
  }
}

class ResultsListMain extends React.Component {
  render() {
    const {files} = this.props;

    return (
      <div className={styles.list}>
        <Header />
        <ScrollList files={files} />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ResultsListMain);
