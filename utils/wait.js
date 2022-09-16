const {setTimeout} = require('core-js');

/**
 * Sleep for ms milliseconds
 * @param {any} ms
 * @return {any}
 */
function wait(ms) {
  return new Promise((resolve) =>setTimeout(() =>resolve(), ms));
};

const defaultTimer = 1000;
const productionTimer = 500;

module.exports = {wait, defaultTimer, productionTimer};
