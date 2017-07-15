const cheerio = require('cheerio');
const Plugin = require('./plugin');

/**
 * Represents a WordPress Plugin search results page.
 * @param {string} html - Html of an entire results page.
 * @returns {{getAllResultsPages: getAllResultsPages, getAllPlugins: getAllPlugins}} Object.
 * @class
 */
function ResultsPage(html) {
  const $ = cheerio.load(html);
  let lastPage = 1;
  let href = '';
  let queryString = '';

  (function initVariables() {
    const $pages = $('a.page-numbers');
    let urlParts = [];

    if ($pages.length > 0) {
      lastPage = parseInt($pages.eq(-2).html().replace(/,/g, ''), 10);
    }
    const $links = $('link');
    $links.each(function forEachLinks() {
      const $this = $(this);
      if ($this.attr('rel') === 'alternate' && $this.attr('hreflang') === 'en') {
        urlParts = $this.attr('href').split('?');
        href = urlParts[0];
        queryString = urlParts[1];
      }
    });
  }());

  /**
   * Based on the current search, returns the list of all results pages (paginated).
   * @returns {Array} Array of string urls, likely with /page/x in it.
   */
  function getAllResultsPages() {
    const allResultsPages = [];
    for (let i = 1; i <= lastPage; i += 1) {
      allResultsPages.push(`${href}page/${i.toString()}?${queryString}`);
    }
    return allResultsPages;
  }

  /**
   * Returns plugins listed on current results page.
   * @returns {Array} Array of plugin objects.
   */
  function getAllPlugins() {
    const plugins = [];

    $('article.plugin-card').each(function forEachPluginCard() {
      const plugin = new Plugin($(this).html());
      plugins.push(plugin.getJson());
    });

    return plugins;
  }

  return {
    getAllResultsPages,
    getAllPlugins,
  };
}

module.exports = ResultsPage;
