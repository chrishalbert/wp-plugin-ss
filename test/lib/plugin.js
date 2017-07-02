var assert = require('assert');
var fs = require('fs');
var should = require('should');

var Plugin = require('./../../lib/plugin');

var plugin;

before(function readPluginFile() {
    fs.readFile(process.env.ROOT_DIR + 'test/data/plugin.html', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        plugin = new Plugin(data).getJson();
    });
});

describe('Plugin', function() {
    describe('#getJson()', function() {
        it('should map the plugin name', function () {
            plugin.name.should.equal('Ninja Forms – The Easy and Powerful Forms Builder');
        });
        it('should map the plugin description', function () {
            plugin.description.should.equal('Drag and drop fields in an intuitive UI to create create contact forms, email subscription forms, order forms, payment forms, send emails and more!');
        });
        it('should map the plugin rating', function () {
            plugin.rating.should.equal(4.5);
        });
        it('should map the plugin ratingCount', function () {
            plugin.ratingCount.should.equal(807);
        });
        it('should map the plugin icon', function () {
            plugin.icon.should.equal('https://ps.w.org/ninja-forms/assets/icon-128x128.png?rev=1649747');
        });
        it('should map the plugin author', function () {
            plugin.author.should.equal('The WP Ninjas');
        });
        it('should map the plugin installs', function () {
            plugin.installs.should.equal(900000);
        });
        it('should map the plugin testedVersion', function () {
            plugin.testedVersion.should.equal('4.8');
        });
    });
});