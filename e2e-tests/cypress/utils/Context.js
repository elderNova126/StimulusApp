const setVariable = (key, value) => {
  window.localStorage.setItem(key, value);
};

const getVariable = (key) => {
  return window.localStorage.getItem(key);
};

module.exports = {
  setVariable,
  getVariable,
};
