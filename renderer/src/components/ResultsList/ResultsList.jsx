import {ipcRenderer} from 'electron';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import {
  selectFile,
  setResultsSortDirection,
  setResultsSortType
} from '../../actions/actions';
import {UP_ARROW_KEY, DOWN_ARROW_KEY} from '../../constants';
import {throttleAnimationFrame} from '../../utils/event-processing';
import {
  SORT_FILE_NAME,
  SORT_SAMPLE_RATE,
  SORT_BITS,
  SORT_CHANNELS,
  SORT_FORMAT,
  SORT_DURATION,
  SORT_PLAYS,
  SORT_ASC,
  SORT_DESC
} from '../../utils/file-utils';
import {
  multiSelectedSelector,
  sortedResultsSelector
} from '../../shared-selectors/file-selectors';
import ImportsList from '../ImportsList/ImportsList.jsx';
import styles from './ResultsList.css';

function mapState(state) {
  const {selectedIds, sortedSelectedFiles} = multiSelectedSelector(state);

  return {
    files: sortedResultsSelector(state),
    multiIds: selectedIds,
    selectedFileId: state.resultsList.selectedId,
    sortType: state.resultsList.sort.type,
    sortDirection: state.resultsList.sort.direction,
    sortedSelectedFiles
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators(
    {
      selectFile,
      setResultsSortType,
      setResultsSortDirection
    },
    dispatch);
}

class ResultsListItem extends React.Component {
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
    this.onDragStart = this._onDragStart.bind(this);
  }

  _onClick(e) {
    this.props.selectFile(this.props.file, e.nativeEvent.ctrlKey || e.nativeEvent.metaKey, e.nativeEvent.shiftKey);
  }

  _onDragStart(e) {
    e.preventDefault();
    const multiPaths = this.props.sortedSelectedFiles.map(file => file.path);
    ipcRenderer.send('ondragstart', this.props.file.path, multiPaths);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // don't compare sortedSelectedFiles
    const compareProps = ['file', 'isSelected', 'isMultiSelected', 'top'];
    for (const prop of compareProps) {
      if (this.props[prop] !== nextProps[prop]) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {file, isSelected, isMultiSelected, top} = this.props;
    let className = '';
    if (isSelected) {
      className = styles.selectedItem;
    } else if (isMultiSelected) {
      className = styles.multiSelectedItem;
    }

    return (
      <li className={className}
        style={{top: top}} onClick={this.onClick} onDragStart={this.onDragStart}
        draggable="true">
        <div className={styles.fileNameCell}>{file.fileName}</div>
        <div className={styles.otherCell}>{file.sampleRate}</div>
        <div className={styles.otherCell}>{file.bitDepth}</div>
        <div className={styles.otherCell}>{file.channels}</div>
        <div className={styles.otherCell}>{file.format}</div>
        <div className={styles.otherCell}>{this.constructor.formatTime(file.durationMs)}</div>
        <div className={styles.otherCell}>TODO</div>
      </li>
    );
  }
}

class SortArrow extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.onClick = this._onClick.bind(this);
  }

  _onClick() {
    const newDirection = this.props.sortDirection === SORT_ASC ? SORT_DESC : SORT_ASC;
    this.props.setDirection(newDirection);
  }

  render() {
    const {sortDirection} = this.props;
    const label = sortDirection === SORT_ASC ? '▲' : '▼';

    return <div className={styles.sortArrow} onClick={this.onClick}>{label}</div>;
  }
}

class SortMenu extends React.PureComponent {
  static sortOptions = [
    ['File Name', SORT_FILE_NAME],
    ['Sample Rate', SORT_SAMPLE_RATE],
    ['Bits', SORT_BITS],
    ['Channels', SORT_CHANNELS],
    ['Format', SORT_FORMAT],
    ['Duration', SORT_DURATION],
    ['Plays', SORT_PLAYS]
  ];

  constructor() {
    super(...arguments);
    this.onChange = this._onChange.bind(this);
  }

  _onChange(e) {
    this.props.setType(e.target.value);
  }

  render() {
    const {sortType} = this.props;
    return (
      <select className={styles.sortMenu} onChange={this.onChange} value={sortType}>
        {this.constructor.sortOptions.map(option => {
          const [label, value] = option;
          return <option value={value} key={value}>{label}</option>;
        })}
      </select>
    );
  }
}

class SortHeader extends React.Component {
  render() {
    const {setDirection, sortDirection, setType, sortType} = this.props;

    return (
      <div className={styles.sortHeader}>
        <span className={styles.headerTitle}>Files</span>
        <div className={styles.sortControls}>

          <div>
            <SortMenu sortType={sortType} setType={setType} />
          </div>
          <SortArrow setDirection={setDirection} sortDirection={sortDirection} />
        </div>
      </div>
    );
  }
}

class Header extends React.PureComponent {
  render() {
    return (
      <div className={styles.listHeader}>
        <div className={styles.fileNameCell}>File Name</div>
        <div className={styles.otherCell}>Sample Rate</div>
        <div className={styles.otherCell}>Bits</div>
        <div className={styles.otherCell}>Channels</div>
        <div className={styles.otherCell}>Format</div>
        <div className={styles.otherCell}>Duration</div>
        <div className={styles.otherCell}>Plays</div>
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

    selectFile(fileToSelect, e.nativeEvent.ctrlKey || e.nativeEvent.metaKey, e.nativeEvent.shiftKey);
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
    const {
      files,
      multiIds,
      selectFile,
      selectedFileId,
      sortedSelectedFiles
    } = this.props;
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
                const isMultiSelected = multiIds[file.id] === true;
                return (
                  <ResultsListItem key={file.id} file={file} top={top}
                    selectFile={selectFile} isSelected={isSelected}
                    isMultiSelected={isMultiSelected}
                    sortedSelectedFiles={sortedSelectedFiles} />
                );
              }
            )}
          </ul>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const {files, selectedFileId, sortType, sortDirection} = this.props;
    if (this.container &&
      (
        selectedFileId && selectedFileId !== prevProps.selectedFileId
        || sortType !== prevProps.sortType
        || sortDirection !== prevProps.sortDirection
      )
    ) {
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
    const {
      files, multiIds, selectFile, selectedFileId,
      sortType, sortDirection, setResultsSortType,
      setResultsSortDirection, sortedSelectedFiles} = this.props;

    return (
      <div className={styles.list}>
        <SortHeader sortType={sortType} sortDirection={sortDirection}
          setType={setResultsSortType} setDirection={setResultsSortDirection} />
        <Header />
        <ScrollList files={files} selectFile={selectFile} selectedFileId={selectedFileId}
          sortType={sortType} sortDirection={sortDirection}
          multiIds={multiIds} sortedSelectedFiles={sortedSelectedFiles} />
        <div className={styles.importsContainer}><ImportsList /></div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ResultsListMain);
