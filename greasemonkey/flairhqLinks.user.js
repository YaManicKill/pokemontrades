// ==UserScript==
// @name         FlairHQ links
// @namespace    http://hq.porygon.co
// @version      0.1.1
// @description  Adds a flairhq link to user's flairs.
// @author       YaManicKill
// @match        https://*.reddit.com/r/pokemontrades/*
// @grant        none
// ==/UserScript==
 
var checkExist = setInterval(function() {
  if ($('.tagline').length) {
    // We want to not do anything until we have one of the links to add something to
    // Then we can get rid of our interval
    clearInterval(checkExist);
    
    $('.tagline').each(function (index, element) {
      $(element).find('a[href*="user"]').each(function (index2, element2) {
        var username = element2.innerHTML;
        var url = "http://hq.porygon.co/u/" + username;
        $(element).find('span.flair').each(function (index3, element3) {
          $(element3).after("<a href='" + url + "'>FlairHQ</a>");
        });
      });
    });
  }
}, 100);
