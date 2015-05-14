// ==UserScript==
// @name         FlairHQ modmail links
// @namespace    http://hq.porygon.co
// @version      0.1
// @description  Adds a flairhq link after sender's name in modmail
// @author       YaManicKill
// @match        https://*.reddit.com/message/moderator/*
// @grant        none
// ==/UserScript==
 
var checkExist = setInterval(function() {
   if ($('.head').length) {
       clearInterval(checkExist);
       $('.sender').each(function (index, element) {
           $(element).find('a[href*="user"]').each(function (index2, element2) {
               var username = element2.innerHTML;
               var url = "http://hq.porygon.co/u/" + username;
               $(element).after(" [<a href='" + url + "'>FHQ</a>]");
           });
       });
   }
}, 100);
