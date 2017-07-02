var assert = require('assert');
var fs = require('fs');
var should = require('should');

var ResultsPage = require('./../../lib/results-page');
var Plugin = require('./../../lib/plugin');

var allResultsPages = [],
    allPlugins = [];

before(function readPluginFile() {
    fs.readFile(process.env.ROOT_DIR + 'test/data/results-page.html', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var resultsPage = new ResultsPage(data);
        allResultsPages = resultsPage.getAllResultsPages();
        allPlugins = resultsPage.getAllPlugins();
    });
});

describe('ResultsPage', function() {
    describe('#getAllResultsPages()', function() {
        it('should return an array of ResultsPage\'s', function() {
            for (var i = 1; i <= 614; i++) {
               allResultsPages.should.containEql('https://wordpress.org/plugins/search/forms/page/' + i.toString());
            }
        });
    });
    describe('#getAllPlugins()', function() {
        it('should return an array of Plugins', function() {
            allPlugins.forEach(function(plugin) {
               plugin.should.be.an.instanceOf(Plugin);
            });
        });
    });
});