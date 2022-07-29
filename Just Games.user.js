// ==UserScript==
// @name         Just Games
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Just%20Games.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Just%20Games.user.js
// @description  Just the games
// @author       Adam
// @match        https://gamersplane.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $, moment, API_HOST */

(function() {
    'use strict';

    $('.flexWrapper.mob-order-2').wrapAll("<div class='allYourGames' />");

    GM_addStyle(`.flexWrapper.mob-order-3,#latestPosts.mob-order-3,#latestPosts.mob-order-2{display:none;}
    @media only screen and (min-width: 601px){
        #hompageRows{
            display:grid;
        }
        .flexWrapper{
            grid-column:1/3;
        }
        .flexWrapper.mob-order-1 .col-1-3{
            width:auto;
        }
        .flexWrapper.mob-order-1{
            grid-column: 1;
            grid-row: 2/4;
        }
        .allYourGames{
            grid-column: 2;
            grid-row: 2/4;
        }
        #yourGames .sudoTable .tr{
            width:50%;
        }
    }
`);

})();