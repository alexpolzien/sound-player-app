import {createSelector} from 'reselect';

import {basicCompare} from '../utils/sort-utils';

const librariesSelector = state => state.libraries.libraries;

export const sortedLibrariesSelector = createSelector(
  librariesSelector,
  (libraries) => {
    const libArray = Object.values(libraries);
    const getSortKey = library => library.name;
    const sortCompare = (lib1, lib2) => basicCompare(lib1, lib2, getSortKey);
    libArray.sort(sortCompare);
    return libArray;
  }
);
