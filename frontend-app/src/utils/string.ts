import { includes } from 'ramda';
import { Contact } from '../components/Company/company.types';
import { ANONYMOUS_ROUTES } from './constants';
import { capitalizeFirstLetter } from './dataMapper';

export const toCapitalCase = (target: string) => {
  return target && target.charAt(0).toUpperCase() + target.slice(1);
};

export const removeHttp = (url: string) => {
  const removedHttp = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
  return toCapitalCase(removedHttp);
};

export type FixNamesObj = 'tags' | 'taxIdNo' | 'internalId';

export const fixNamesObj = (field: string, from?: string, to?: string): string => {
  const defaultValue = 'not found';
  const obj = {
    tags: from || to ? tagsMessage(from ? from : null, to ? to : null) : 'Tags',
    taxIdNo: 'Tax ID No',
    internalId: 'Internal ID',
  };
  return obj[field as FixNamesObj] || replaceUpperCase(field) || defaultValue;
};

const tagsMessage = (from: string | null, to: string | null) => {
  const fromLikeArray = from ? from.split(',') : [];
  const toLikeArray = to ? to.split(',') : [];
  const removed = fromLikeArray.filter((item) => !toLikeArray.includes(item));
  const added = toLikeArray.filter((item) => !fromLikeArray.includes(item));
  const and = added.length >= 1 && removed.length >= 1 ? 'and' : '';
  return ` ${added.length >= 1 ? `added: ${added.join(', ')}` : ''} ${and} ${
    removed.length >= 1 ? `removed: ${removed.join(', ')}` : ''
  } Tags `;
};

export const isAnonymousRoute = (route: string) => {
  return includes(route, ANONYMOUS_ROUTES);
};

export const parseFullName = (contact?: Contact) => {
  if (!contact) return '';
  const { fullName, firstName, middleName, lastName } = contact;

  if (!fullName) {
    let name = '';
    firstName && (name += capitalizeFirstLetter(firstName));
    middleName && (name += ' ' + capitalizeFirstLetter(middleName));
    lastName && (name += ' ' + capitalizeFirstLetter(lastName));
    return name || '-';
  } else {
    return fullName;
  }
};

export const removeDuplicatesInArrayOfString = (names?: string[]) => {
  if (typeof names === 'undefined') return [];
  return names?.filter((name, index) => names.indexOf(name) === index);
};

export const checkIfArraysAreEqual = (arr1: string[], arr2: string[]) => {
  return arr1?.length === arr2?.length && arr1.every((value, index) => value === arr2[index]);
};

export const replaceUpperCase = (str: string) => {
  str = str[0].toUpperCase() + str.slice(1);
  return str.replace(/([A-Z])/g, ' $1').trim();
};
