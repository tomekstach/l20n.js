'use strict';

import { L10nError } from '../../lib/errors';

export function serializeEntries(lang, langEntries, sourceEntries) {
  const errors = [];
  const entries = Object.create(null);

  for (let id in sourceEntries) {
    const sourceEntry = sourceEntries[id];
    const langEntry = langEntries[id];

    if (!langEntry) {
      errors.push(new L10nError(
        '"' + id + '"' + ' not found in ' + lang.code, id, lang));
      entries[id] = sourceEntry;
      continue;
    }

    if (!areEntityStructsEqual(sourceEntry, langEntry)) {
      errors.push(new L10nError(
        '"' + id + '"' + ' is malformed in ' + lang.code, id, lang));
      entries[id] = sourceEntry;
      continue;
    }

    entries[id] = langEntry;
  }

  return [errors, entries];
}

function resolvesToString(entity) {
  return typeof entity === 'string' ||  // a simple string
    typeof entity.value === 'string' || // a simple string, entity with attrs
    Array.isArray(entity.value) ||      // a complex string
    entity.index !== null;              // a dict with an index
}

function areEntityStructsEqual(entity1, entity2) {
  if (resolvesToString(entity1) && resolvesToString(entity2)) {
    return true;
  }

  const keys1 = Object.keys(entity1);
  const keys2 = Object.keys(entity2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i++) {
    if (keys2.indexOf(keys1[i]) === -1) {
      return false;
    }
  }

  return true;
}