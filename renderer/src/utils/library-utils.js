import {basicCompare} from '../utils/sort-utils';

const getSortKey = library => library.name;
const sortCompare = (lib1, lib2) => basicCompare(lib1, lib2, getSortKey);

export function sortLibrariesArray(libs) {
  libs.sort(sortCompare);
}
