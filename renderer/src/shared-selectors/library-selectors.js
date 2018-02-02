import {createSelector} from 'reselect';

import {sortLibrariesArray} from '../utils/library-utils';

const librariesSelector = state => state.libraries.libraries;

export const sortedLibrariesSelector = createSelector(
  librariesSelector,
  (libraries) => {
    const libArray = Object.values(libraries);
    sortLibrariesArray(libArray);
    return libArray;
  }
);
