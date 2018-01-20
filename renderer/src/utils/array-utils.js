export function arraysAreSame(arr1, arr2) {
  // return true if the arrays are identical
  if (arr1.length !== arr2.length) {
    return false;
  }

  const len = arr1.length;
  for (let i = 0; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function splitAtTail(arr) {
  if (arr.length === 0) {
    return [[], null];
  }
  const head = arr.slice(0, arr.length - 1);
  const tail = arr[arr.length - 1];
  return [head, tail];
}
