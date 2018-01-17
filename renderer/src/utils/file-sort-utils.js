export const SORT_FILE_NAME = 'SORT_FILE_NAME';
export const SORT_SAMPLE_RATE = 'SORT_SAMPLE_RATE';
export const SORT_BITS = 'SORT_BITS';
export const SORT_CHANNELS = 'SORT_CHANNELS';
export const SORT_FORMAT = 'SORT_FORMAT';
export const SORT_DURATION = 'SORT_DURATION';
export const SORT_PLAYS = 'SORT_PLAYS';

export const SORT_ASC = 'SORT_ASC';
export const SORT_DESC = 'SORT_DESC';

function sortCompare(file1, file2, getKey) {
  const key1 = getKey(file1);
  const key2 = getKey(file2);

  if (key1 < key2) {
    return -1;
  } else if (key1 > key2) {
    return 1;
  }
  return 0;
}

function sortFilesArray(filesArray, getSortKey, sortDirection, getTieBreakerKey) {
  filesArray.sort(
    (file1, file2) => {
      let cmpResult = sortCompare(file1, file2, getSortKey);
      if (sortDirection === 'SORT_DESC') {
        cmpResult = cmpResult * -1;
      }
      if (cmpResult === 0 && typeof getTieBreakerKey === 'function') {
        cmpResult = sortCompare(file1, file2, getTieBreakerKey);
      }
      return cmpResult;
    }
  );
}

const getFileName = file => file.fileName;
const getSampleRate = file => file.sampleRate;
const getBits = file => file.bitDepth;
const getChannels = file => file.channels;
const getFormat = file => file.format;
const getDuration = file => file.durationMs;
const getPlays = file => file.plays;

function getSortKeyFunctions(sortType) {
  // returns [sort key function, tie-breaker key function]
  switch (sortType) {
    case SORT_FILE_NAME:
      return [getFileName, null];
    case SORT_SAMPLE_RATE:
      return [getSampleRate, getFileName];
    case SORT_BITS:
      return [getBits, getFileName];
    case SORT_CHANNELS:
      return [getChannels, getFileName];
    case SORT_FORMAT:
      return [getFormat, getFileName];
    case SORT_DURATION:
      return [getDuration, getFileName];
    case SORT_PLAYS:
      return [getPlays, getFileName];
  }
}

export function getSortedFilesArray(filesMap, sortType, sortDirection) {
  const filesArray = [];
  for (const fileId in filesMap) {
    filesArray.push(filesMap[fileId]);
  }
  const [getSortKey, getTieBreakerKey] = getSortKeyFunctions(sortType);
  sortFilesArray(filesArray, getSortKey, sortDirection, getTieBreakerKey);
  return filesArray;
}
