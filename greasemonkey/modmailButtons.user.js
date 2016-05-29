// ==UserScript==
// @name         Additional Modmail Management Buttons
// @namespace    https://www.reddit.com/r/pokemontrades
// @version      1.0.1
// @description  Adds an approve button for removed modmails, as well as a remove button for your own sent modmail messages.
// @author       /u/SnowPhoenix9999
// @match        https://*.reddit.com/message/*
// @match        https://*.reddit.com/r/*/about/message/inbox/
// @match        https://*.reddit.com/r/*/message/moderator/inbox
// @grant        none
// ==/UserScript==

var approveButton = '<li><form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="approved"><span class="option main active"><a href="#" class="togglebutton access-required" onclick="return toggle(this)" data-event-action="approve">approve</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;approve&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form></li>';
var removeButton =  '<li><form class="toggle remove-button " action="#" method="get"><input type="hidden" name="executed" value="removed"><input type="hidden" name="spam" value="False"><span class="option main active"><a href="#" class="togglebutton access-required" onclick="return toggle(this)" data-event-action="remove">remove</a></span><span class="option error">are you sure?  <a href="javascript:void(0)" class="yes" onclick="change_state(this, &quot;remove&quot;, null, undefined, null)">yes</a> / <a href="javascript:void(0)" class="no" onclick="return toggle(this)">no</a></span></form></li>';

function addButtons(baseObj) {
    $(baseObj+" .thing.recipient.spam li.report-button").before(approveButton);
    $(baseObj+" .thing.spam").not(".recipient").children(".entry").find(".flat-list.buttons a[data-event-action='reply']").parent().before(approveButton);
    $(baseObj+" .thing").not(".recipient").not(".spam").children(".entry").find(".flat-list.buttons a[data-event-action='reply']").parent().before(removeButton);
}

$(document).ready(function() {
    addButtons('#siteTable');
});

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type==='childList') {
        addButtons('#'+mutation.addedNodes[0].id);
    }
  });
});

observer.observe(document.querySelector('#siteTable'), {childList: true});
