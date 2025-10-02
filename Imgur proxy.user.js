// ==UserScript==
// @name         Imgur proxy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Imgur%20proxy.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Imgur%20proxy.user.js
// @description  Replace Imgur links with proxy links
// @author       Adam
// @match        https://gamersplane.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';
    const regexImgur = /(^|[^\=])(https:\/\/i\.imgur\.com\/)/gm;
    const subst = '$1https://proxy.duckduckgo.com/iu/?u=$2';

    var proxyImgs=function()
    {
        $('img[src]').each(function() {
            var pThis = $(this);
            pThis.attr('src', pThis.attr('src').replace(regexImgur, subst));
        });
        $('span[style]').each(function() {
            var pThis = $(this);
            var bg=pThis.css('background-image');
            if (bg) {
                pThis.css('background-image', bg.replace(regexImgur, subst));
            }
        });
    };

    $(document).on( 'ajaxComplete', function() {
        proxyImgs();
    });

    proxyImgs();

})();