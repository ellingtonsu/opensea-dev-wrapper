const {setTimeout} = require('core-js');

/**
 * Sleep for ms milliseconds
 * @param {any} ms
 * @return {any}
 */
function wait(ms) {
  return new Promise((resolve) =>setTimeout(() =>resolve(), ms));
};

const defaultTimer = 800;
const productionTimer = 300;

module.exports = {wait, defaultTimer, productionTimer};
