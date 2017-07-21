# Wordpress Plugin Simplified Search
[![Build Status](https://travis-ci.org/chrishalbert/wp-plugin-ss.svg?branch=master)](https://travis-ci.org/chrishalbert/wp-plugin-ss) [![Coverage Status](https://coveralls.io/repos/github/chrishalbert/wp-plugin-ss/badge.svg?branch=master)](https://coveralls.io/github/chrishalbert/wp-plugin-ss?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node API that provides filtering and sorting for WordPress Plugins. 

(or wp-plugin-ss, if you are into the brevity thing) 

## Why?
Searching for plugins on [Wordpress.org](https://wordpress.org/plugins/) can be time consuming since you cannot add filters  
to specific fields and there is no such thing as sorting. To minimize these headaches, these features were introduced
via wp-plugin-ss for you to use or extend upon. 

## Dependencies

### MongoDb (required)
The WordPress Plugin Simplified Search API returns results
 directly from MongoDB. A data dump is available in the dump folder.
 
### Redis (optional)
If you would like something more up to date than the data dump,
you can run the cron and then run workers to up date your
Mongo data. 

## Installation
You will need to add configurations somehow, and then you can either add this to a project,
or it run it locally.

### Configurations
Determine the configuration variables and save this to a /path/to/file.
```
export WP_PLUGIN_SS_MONGODB_URI=mongodb://127.0.0.1:27017/test
export WP_PLUGIN_SS_REDIS_URL=redis://127.0.0.1:19879
export WP_PLUGIN_SS_REDIS_QUEUE=plugins
```
You will either need to run the above script (locally) or assign these values in your IDE/cloud service. If not, export configurations to environment locally:
```bash
$ chmod 777 /path/to/file # Makes it executable
$ . /path/to/file         # Runs the script above
```

### Add to Project
```bash
$ npm install wp-plugin-ss
```

### Run Locally
This is good if you want to do some searches for yourself and test it out (replace the values in braces, likely localhost and 27017 if local).
```bash
$ npm install wp-plugin-ss -g    # Installs the API
$ mongorestore --db {mongo db} --host {mongo host} --port {mongo port}  ~/.npm-packages/lib/node_modules/wp-plugin-ss/dump/test 
$ . /path/to/file                # Loads the configuration
$ wp-plugin-ss                   # Starts the API
```

### Populate database:
Run this to populate your mongo database with some starting data.
```
$ mongorestore --db {mongo db} --host {mongo host} --port {mongo port}  ~/.npm-packages/lib/node_modules/wp-plugin-ss/dump/test 
```

### Run

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
