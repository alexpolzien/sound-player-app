export function basicCompare(item1, item2, getKey) {
  const key1 = getKey(item1);
  const key2 = getKey(item2);

  if (key1 < key2) {
    return -1;
  } else if (key1 > key2) {
    return 1;
  }
  return 0;
}
