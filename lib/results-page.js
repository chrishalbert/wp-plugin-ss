const cheerio = require('cheerio');
const Plugin = require('./plugin');

function ResultsPage(html) {
  const $ = cheerio.load(html);
  let lastPage = 1;

  function getBasePath() {
    const $pages = $('a.page-numbers');

    if ($pages.length > 0) {
      lastPage = parseInt($pages.eq(-2).html(), 10);
    }
    const $links = $('link');
    let href = '';
    $links.each(function forEachLinks() {
      const $this = $(this);
      if ($this.attr('rel') === 'alternate' && $this.attr('hreflang') === 'en') {
        href = $this.attr('href');
      }
    });
    return href.substring(0, href.lastIndexOf('/'));
  }

  function getAllResultsPages() {
    const allResultsPages = [];
    const basePath = getBasePath();
    for (let i = 1; i <= lastPage; i += 1) {
      allResultsPages.push(`${basePath}/${i.toString()}`);
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
    getAllResultsPages: getAllResultsPages(),
    getAllPlugins: getAllPlugins(),
  };
}

module.exports = ResultsPage;
