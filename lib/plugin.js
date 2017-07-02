var cheerio = require('cheerio');

module.exports = Plugin;

function Plugin(html) {

    var self = this,
        $ = cheerio.load(html);

    this.name = $('.entry-title a').text(),
    this.description = $('.entry-excerpt p').text(),
    this.rating = parseFloat($('.wporg-ratings').attr('data-rating')),
    this.ratingCount = parseInt($('.rating-count a').text(), 10),
    this.icon = $('.entry-thumbnail').html().match(/\((.*?)\)/)[1].replace(/('|")/g,''),
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