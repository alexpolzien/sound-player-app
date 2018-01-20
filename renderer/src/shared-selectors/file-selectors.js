import {createSelector} from 'reselect';

import {getSortedFilesArray} from '../utils/file-sort-utils';

const filesSelector = state => state.resultsList.files;
const selectedFileIdSelector = state => state.resultsList.selectedId;
const selectRangesSelector = state => state.resultsList.selectRanges;
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

export const multiSelectedSelector = createSelector(
  sortedResultsSelector,
  selectRangesSelector,
  (results, ranges) => {
    // iterate through results and find the start and end of each range
    const idToIndex = {}; // file id to array index
    for (const range of ranges) {
      idToIndex[range.startId] = null;
      idToIndex[range.endId] = null;
    }

    // find indices for each range start and end
    for (let i = 0; i < results.length; i++) {
      const file = results[i];
      if (file.id in idToIndex) {
        idToIndex[file.id] = i;
      }
    }

    // collect all the selected ids
    const selectedIds = {};
    const selectedFiles = [];
    for (const range of ranges) {
      const startIndex = idToIndex[range.startId];
      const endIndex = idToIndex[range.endId];
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);

      // iterate over the range
      for (let i = minIndex; i <= maxIndex; i++) {
        const file = results[i];
        selectedIds[file.id] = true;
        selectedFiles.push({index: i, file});
      }
    }

    // sort the selected files by their order in the list
    selectedFiles.sort(
      (a, b) => {
        if (a.index < b.index) {
          return -1;
        } else if (a.index > b.index) {
          return 1;
        }
        return 0;
      }
    );

    const sortedSelectedFiles = selectedFiles.map(item => item.file);

    return {selectedIds, sortedSelectedFiles};
  }
);
