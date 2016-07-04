'use strict';
const START_MARKER = '[//]:# (BEGIN NEWS)';
const END_MARKER = '[//]:# (END NEWS)';
const SUBREDDIT_NAME = 'pokemontrades';

const snoowrap = require('snoowrap');
// scope: read wikiedit wikiread
const r = new snoowrap(require('../oauth_info'));
const pokemontrades = r.getSubreddit(SUBREDDIT_NAME);
pokemontrades.getWikiPage('config/sidebar').fetch().get('content_md').then(sidebar => {
  return pokemontrades.search({query: 'flair_css_class:info', time: 'all', sort: 'new', limit: 5, syntax: 'lucene'}).then(results => {
    const startIndex = sidebar.indexOf(START_MARKER) + START_MARKER.length;
    const endIndex = sidebar.indexOf(END_MARKER);
    if (startIndex === START_MARKER.length - 1 || endIndex === -1 || endIndex < startIndex) {
      throw new TypeError('Could not find start/end markers');
    }
    const formattedResults = results.slice(0, 5).map(result => `* [${result.title}](https://redd.it/${result.id})`).join('\n');
    return sidebar.slice(0, startIndex) + '\n' + formattedResults + '\n' + sidebar.slice(endIndex);
  });
}).then(updatedSidebar => {
  return pokemontrades.getWikiPage('config/sidebar').edit({text: updatedSidebar, reason: 'Update recent news'});
}).catch(console.error);
