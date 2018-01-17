import {createSelector} from 'reselect';

import {getSortedFilesArray} from '../utils/file-sort-utils';

const filesSelector = state => state.resultsList.files;
const selectedFileIdSelector = state => state.resultsList.selectedId;
const sortTypeSelector = state => state.resultsList.sort.type;
const sortDirectionSelector = state => state.resultsList.sort.direction;

export const sortedResultsSelector = createSelector(
  filesSelector,
  sortTypeSelector,
  sortDirectionSelector,
  (files, sortType, sortDirection) => getSortedFilesArray(files, sortType, sortDirection)
);

export const nextFileSelector = createSelector(
  sortedResultsSelector,
  selectedFileIdSelector,
  (results, selectedFileId) => {
    if (!results.length) {
      return null;
    }

    let nextFile;

    if (!selectedFileId) {
      nextFile = results[0];
    } else {
      const selectedIndex = results.findIndex(file => file.id === selectedFileId);
      if (selectedIndex === -1 || selectedIndex === results.length - 1) {
        nextFile = results[0];
      } else {
        nextFile = results[selectedIndex + 1];
      }
    }

    return nextFile;
  }
);
