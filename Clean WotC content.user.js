// ==UserScript==
// @name         Clean WotC content
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Clean%20WotC%20content.user.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Clean%20WotC%20content.user.user.js
// @description  Clean content copied from WotC pdfs
// @author       Adam
// @match        https://gamersplane.com/forums/thread/*
// @match        https://gamersplane.com/characters/custom/*/edit/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';
    GM_addStyle(`
    .markItUpHeader>ul>li.markItUpButtonCleanWotC>a::after {
    content: "\\eada";
}`);

    var newButton=$('<li class="markItUpButton markItUpButtonCleanWotC"><a title="Clean"></a></li>').appendTo($('.markItUpContainer .markItUpHeader ul'));
    newButton.on('click',function(){
        var txtArea=$('.markItUpContainer textarea');

        if(txtArea.length==1){
            var val=txtArea.val();
            var txtEle=txtArea[0];
            var start = txtEle.selectionStart;
            var end = txtEle.selectionEnd;
            var selectedText = val.slice(start, end);
            var before = val.slice(0, start);
            var after = val.slice(end);
            selectedText=selectedText.replace(/©20[0-9]{2}.*$/gm,'');
            selectedText=selectedText.replace(/\t/gm,' ');
            selectedText=selectedText.replace(/(([A-Z]+[ ]?)+)$/gm,'\n#$1');
            selectedText=selectedText.replace(/[ ]\n/gm,' ');
            var text = before + selectedText+ after;
            txtArea.val(text);
        }
    });
})();