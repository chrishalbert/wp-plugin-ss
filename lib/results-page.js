var cheerio = require('cheerio');
var Plugin = require('./plugin');

module.exports = ResultsPage;

function ResultsPage(html) {

    var $ = cheerio.load(html),
        lastPage = 1;

    var getBasePath = function () {
        var $pages = $('a.page-numbers');

        if ($pages.length > 0) {
            lastPage = parseInt($pages.eq(-2).html(), 10);
        }
        var $links = $('link'),
            href = '';
        $links.each(function() {
            var $this = $(this);
            if ($this.attr('rel') == 'alternate' && $this.attr('hreflang') == 'en') {
                href = $this.attr('href');
            }
        });
        return href;
    };

    function getAllResultsPages() {
        var allResultsPages = [],
            basePath = getBasePath();
        for (var i = 1; i <= lastPage; i++) {
            allResultsPages.push(basePath + '/page/' + i.toString());
        }
        return allResultsPages;
    }

    function getAllPlugins() {
        var plugins = [];

        $('article.plugin-card').each(function () {
            var article = new Plugin($(this).html());
            plugins.push(article.getJson());
        });

        return plugins;
    }

    return {
        getAllResultsPages: getAllResultsPages,
        getAllPlugins: getAllPlugins
    };
}