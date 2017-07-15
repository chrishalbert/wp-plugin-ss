const cheerio = require('cheerio');
const Plugin = require('./plugin');

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
        urlParts = $this.attr('href').split('?')
        href = urlParts[0];
        queryString = urlParts[1];
      }
    });
  }());

  function getAllResultsPages() {
    const allResultsPages = [];
    for (let i = 1; i <= lastPage; i += 1) {
      allResultsPages.push(`${href}page/${i.toString()}?` + queryString);
    }
    return allResultsPages;
  }

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
