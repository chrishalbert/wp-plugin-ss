var cheerio = require('cheerio');

module.exports = Plugin;

function Plugin(html) {

    var self = this,
        $ = cheerio.load(html);

    this.name = $('.entry-title a').html();
    this.description = $('.entry-excerpt p').html(),
    this.rating = parseInt($('.wporg-ratings').attr('data-rating'), 10),
    this.ratingCount = $('.rating-count a').html(),
    this.icon = '',
    this.author = $('.plugin-author').html(),
    this.installs = $('.active-installs').html(),
    this.testedVersion = $('.tested-with').html();

    var getJson = function() {
        return self;
    };

    return {
        getJson: getJson,
    };
}