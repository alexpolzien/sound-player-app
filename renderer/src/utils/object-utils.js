export function copyWithoutEntries(object, ...keys) {
  const copy = {};
  const omitKeys = new Set(keys);

  for (const key in object) {
    if (!omitKeys.has(key)) {
      copy[key] = object[key];
    }
  }

  return copy;
}
