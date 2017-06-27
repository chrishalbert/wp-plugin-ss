var cheerio = require('cheerio');

module.exports = Plugin;

function Plugin(html) {

    var self = this,
        $ = cheerio.load(html);

    this.name = $('.entry-title a').html();
    this.description = $('.entry-excerpt p').html(),
    this.rating = parseInt($('.wporg-ratings').attr('data-rating'), 10),
    this.ratingCount = parseInt($('.rating-count a').text(), 10),
    this.icon = '',
    this.author = $('.plugin-author').text().trim(),
    this.installs = parseInt($('.active-installs').text().replace(/,/g, ""), 10),
    this.testedVersion = $('.tested-with').text().split(" ").pop();

    var getJson = function() {
        return self;
    };

    return {
        getJson: getJson,
    };
}