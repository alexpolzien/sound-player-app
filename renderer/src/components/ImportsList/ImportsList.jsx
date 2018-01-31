import React from 'react';
import {connect} from 'react-redux';
import {CSSTransitionGroup} from 'react-transition-group';
import {createSelector} from 'reselect';

import styles from './ImportsList.css';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import {basicCompare} from '../../utils/sort-utils';

const importsSelector = state => state.imports.activeImports;
const getSortKey = anImport => anImport.timeCreated * -1;
const sortCompare = (import1, import2) => basicCompare(import1, import2, getSortKey);

const sortedImportsSelector = createSelector(
  importsSelector,
  (imports) => {
    // sort newest imports first
    const importsArray = Object.values(imports);
    importsArray.sort(sortCompare);
    return importsArray;
  }
);

function mapState(state) {
  return {
    imports: sortedImportsSelector(state)
  };
}

class CancelButton extends React.Component {
  // TODO: cancel action
  render() {
    return (
      <div className={styles.cancelButton}></div>
    );
  }
}

class ImportItem extends React.Component {
  countFiles(predicate) {
    let count = 0;
    const files = this.props.import.files;
    for (const filePath in files) {
      if (predicate(files[filePath])) {
        count++;
      }
    }
    return count;
  }

  get totalFilesCount() {
    return this.countFiles(_ => true);
  }

  get completedFilesCount() {
    return this.countFiles(file => file.status === 'decoded');
  }

  render() {
    const anImport = this.props.import;
    const totalFiles = this.totalFilesCount;

    if (totalFiles === 0) {
      return null;
    }

    const progress = this.completedFilesCount / totalFiles;

    const label = totalFiles === 1 ? 'file' : 'files';

    return (
      <div className={styles.import}>
        <div className={styles.main}>
          Importing {this.totalFilesCount} {label}
          <div className={styles.progress}>
            <ProgressBar width={140} height={4}
              radius={2} progress={progress}
              borderColor="rgba(255, 255, 255, 0.7)"
              borderWidth={1}
              barColor="#fcfcfc" />
          </div>
        </div>
        <div className={styles.cancelBox}>
          <CancelButton importId={anImport.id} />
        </div>
      </div>
    );
  }
}

class ImportsListMain extends React.Component {
  render() {
    const {imports} = this.props;
    return (
      <div>
        <CSSTransitionGroup transitionName={{
            enter: styles.listEnter,
            enterActive: styles.listEnterActive,
            leave: styles.listLeave,
            leaveActive: styles.listLeaveActive
          }}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={5300}>
          {imports.map(anImport => <div key={anImport.id}><ImportItem import={anImport} /></div>)}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default connect(mapState, null)(ImportsListMain);
