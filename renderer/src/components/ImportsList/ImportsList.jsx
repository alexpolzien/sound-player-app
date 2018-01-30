import React from 'react';
import {connect} from 'react-redux';
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
    return (
      <div className={styles.import}>
        Importing {this.totalFilesCount} files
        <div className={styles.progress}>
          <ProgressBar width={140} height={4}
            radius={2} progress={0.5}
            borderColor="rgba(255, 255, 255, 0.7)"
            borderWidth={1}
            barColor="#fcfcfc" />
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
        {imports.map(anImport => <ImportItem key={anImport.id} import={anImport} />)}
      </div>
    );
  }
}

export default connect(mapState, null)(ImportsListMain);
