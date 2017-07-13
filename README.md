# Wordpress Plugin Simplified Search
[![Build Status](https://travis-ci.org/chrishalbert/wp-plugin-ss.svg?branch=master)](https://travis-ci.org/chrishalbert/wp-plugin-ss) [![Coverage Status](https://coveralls.io/repos/github/chrishalbert/wp-plugin-ss/badge.svg?branch=master)](https://coveralls.io/github/chrishalbert/wp-plugin-ss?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node API that provides filtering and sorting for WordPress Plugins. 

(or wp-plugin-ss, if you are into the brevity thing) 

## Why?
Searching for plugins on [Wordpress.org](https://wordpress.org/plugins/) can be time consuming since you cannot add filters  
to specific fields and there is no such thing as sorting. To minimize these headaches, these features were introduced
via wp-plugin-ss for you to use or extend upon. 

## Installation

### Project
Add to your project:
```bash
$ npm install wp-plugin-ss
```

### Locally
This is good if you want to do some searches for yourself and test it out.
```bash
$ sudo npm install wp-plugin-ss -g # Installs the API
$ wp-plugin-ss                     # Starts the API
```
Use swagger docs to test at http://127.0.0.1:3000/api-docs/

OR

Go to http://127.0.0.1:3000/plugins and consult the API Usage below

## Usage

### **<code>GET</code> /plugins**

## Parameters
- **search** _(required)_ — (string) Search text passed directly to the WordPress Plugin Search. Must be 3 characters.
- **author** - Filters by author name.
- **minRating** - (integer) Filter by having at least minRating
- **maxRating** - (integer) Filter by having at most maxRating
- **minReviews** - (integer) Filter by having at least minReviews
- **maxReviews** - (integer) Filter by having at most maxReviews
- **minInstalls** - (integer) Filter by having at least minInstalls
- **maxInstalls** - (integer) Filter by having at most maxInstalls
- **minVersion** - (string) Filter by having at least minVersion
- **maxVersion** - (string) Filter by having at most maxVersion
- **sort** — Comma separated list of values. Sorts ascending unless preceeded with minus symbol - 
    ###### Recognized values:
    - 'ratings'
    - 'reviews'
    - 'installs'
    - 'authors'
    - 'name'
    - 'version'
    
## Examples: 
Get SEO plugins with at least a rating of 4.
```
http://127.0.0.1:3000/plugins?search=seo&minRatings=4
```
Get input plugins with at least 1000 installs ordering by name.
```
http://127.0.0.1:3000/plugins?search=input&minInstalls=1000&sort=name
```
Get analytics plugins order by the most ratings first (descending)
```
http://127.0.0.1:3000/plugins?search=analytics&sort=-ratings
```
Get ajax plugin ordered by most recent version tested and then most installs.
```
http://127.0.0.1:3000/plugins?search=ajax&sort=-version,-installs
```


