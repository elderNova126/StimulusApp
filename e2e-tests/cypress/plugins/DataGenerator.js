import { faker } from '@faker-js/faker';

function getNameRandom() {
  return faker.company.name();
}
function getUsernameRandom() {
  return faker.person.firstName() + faker.number.int({ min: 100, max: 999 });
}
function getNumberRandom() {
  return faker.number.int();
}
function getNumber() {
  return faker.number.int({ min: 1111111, max: 9999999 });
}
function getCityRandom() {
  return faker.location.city();
}
function getAddressRandom() {
  return faker.location.streetAddress();
}
function getZipCodeRandom() {
  return faker.location.zipCode();
}
function getEmailRandom() {
  return faker.internet.email();
}
function getPhoneRandom() {
  return faker.phone.number();
}
function getCountry() {
  return faker.location.country();
}
function getTaxId() {
  return 'US:01-' + faker.number.int({ min: 1000000, max: 9999999 });
}

module.exports = {
  getNameRandom,
  getUsernameRandom,
  getNumberRandom,
  getNumber,
  getCityRandom,
  getAddressRandom,
  getZipCodeRandom,
  getEmailRandom,
  getPhoneRandom,
  getCountry,
  getTaxId,
};
