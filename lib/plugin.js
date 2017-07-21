const cheerio = require('cheerio');

/**
 * Basic details on a wordpress plugin.
 * @param {string} html - Html to be parsed.
 * @returns {{getJson: getJson}} An object with a getJson method.
 * @class
 */
function Plugin(html) {
  const self = this;
  const $ = cheerio.load(html);

  this.name = $('.entry-title a').text();
  this.description = $('.entry-excerpt p').text();
  this.rating = parseFloat($('.wporg-ratings').attr('data-rating'));
  this.reviews = parseInt($('.rating-count a').text(), 10);
  this.icon = $('.entry-thumbnail').html().match(/\((.*?)\)/)[1].replace(/('|")/g, '');
  this.author = $('.plugin-author').text().trim();
  this.installs = parseInt($('.active-installs').text().replace(/[^0-9]/g, ''), 10);
  this.testedVersion = $('.tested-with').text().split(' ').pop();

  /**
   * Returns oneself in json.
   * @returns {Plugin} Json representation of the plugin.
   */
  function getJson() {
    return self;
  }

  return {
    getJson,
  };
}

module.exports = Plugin;
