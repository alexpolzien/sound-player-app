import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import {selectFile} from '../../actions/actions';
import {UP_ARROW_KEY, DOWN_ARROW_KEY} from '../../constants';
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
    files: sortedResultsSelector(state),
    selectedFileId: state.resultsList.selectedId
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({selectFile}, dispatch);
}

class ResultsListItem extends React.PureComponent {
  static formatTime(duration) {
    const secs = Math.floor(duration / 1000);
    let ms = (duration % 1000).toString();
    while (ms.length < 3) {
      ms = '0' + ms;
    }
    return `${secs}.${ms}`;
  }

  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.props.selectFile(this.props.file);
  }

  render() {
    const {file, isSelected, top} = this.props;
    return (
      <li className={isSelected ? styles.selectedItem : ''} style={{top: top}} onClick={this.onClick}>
        <div className={styles.fileNameCell}>{file.fileName}</div>
        <div className={styles.otherCell}>{file.sampleRate}</div>
        <div className={styles.otherCell}>{file.bitDepth}</div>
        <div className={styles.otherCell}>{file.channels}</div>
        <div className={styles.otherCell}>{file.format}</div>
        <div className={styles.otherCell}>{this.constructor.formatTime(file.durationMs)}</div>
      </li>
    );
  }
}

class Header extends React.PureComponent {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.fileNameCell}>File Name</div>
        <div className={styles.otherCell}>Sample Rate</div>
        <div className={styles.otherCell}>Bits</div>
        <div className={styles.otherCell}>Channels</div>
        <div className={styles.otherCell}>Format</div>
        <div className={styles.otherCell}>Duration</div>
      </div>
    );
  }
}

class ScrollList extends React.PureComponent {
  static paddingPages = 2;
  static rowHeight = 20;

  constructor() {
    super(...arguments);
    this.state = {
      scrollPosition: 0,
      scrollHeight: 0
    };
    this.onKeyDown = this._onKeyDown.bind(this);
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

  _onKeyDown(e) {
    // prevent default scroll
    const keyCode = e.keyCode;

    if (keyCode === UP_ARROW_KEY || keyCode === DOWN_ARROW_KEY) {
      e.preventDefault();
    } else {
      return;
    }

    const {files, selectFile, selectedFileId} = this.props;
    if (!files.length) {
      return;
    }

    let fileToSelect;

    // select top or bottom if none currently selected
    if (!selectedFileId) {
      if (keyCode === UP_ARROW_KEY) {
        fileToSelect = files[0];
      } else if (keyCode === DOWN_ARROW_KEY) {
        fileToSelect = files[file.length - 1];
      }
    } else {
      let selectedIndex = files.findIndex(file => file.id === selectedFileId);
      if (keyCode === UP_ARROW_KEY) {
        selectedIndex --;
      } else if (keyCode === DOWN_ARROW_KEY) {
        selectedIndex++;
      }
      if (selectedIndex === -1) {
        selectedIndex = files.length - 1;
      } else if (selectedIndex === files.length) {
        selectedIndex = 0;
      }
      fileToSelect = files[selectedIndex];
    }

    selectFile(fileToSelect);
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
    const {files, selectFile, selectedFileId} = this.props;
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
          <ul style={{height: totalHeight}} onKeyDown={this.onKeyDown} tabIndex="0">
            {visibleFiles.map((file, i) =>
              {
                const top = (i + topRowsHidden) * this.constructor.rowHeight;
                const isSelected = file.id === selectedFileId;
                return (
                  <ResultsListItem key={file.id} file={file} top={top}
                    selectFile={selectFile} isSelected={isSelected} />
                );
              }
            )}
          </ul>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const {files, selectedFileId} = this.props;
    if (this.container && selectedFileId && selectedFileId !== prevProps.selectedFileId) {
      // if the selected file changed, and it is not in the viewport, scroll to it
      const top = this.container.scrollTop;
      const viewportHeight = this.container.offsetHeight;
      const bottom = top + viewportHeight;
      const rowHeight = this.constructor.rowHeight;

      // find selected files position
      const index = files.findIndex(file => file.id === selectedFileId);
      const position = index * rowHeight;

      let newScrollTop;
      // is it above or below the viewport?
      if (position < top) {
        newScrollTop = position;
      } else if (position + rowHeight > bottom) {
        newScrollTop = Math.max(0, position - viewportHeight + rowHeight);
      }

      if (newScrollTop) {
        this.container.scrollTop = newScrollTop;
      }
    }
  }
}

class ResultsListMain extends React.Component {
  render() {
    const {files, selectFile, selectedFileId} = this.props;

    return (
      <div className={styles.list}>
        <Header />
        <ScrollList files={files} selectFile={selectFile} selectedFileId={selectedFileId} />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ResultsListMain);
