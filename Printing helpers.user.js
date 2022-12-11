// ==UserScript==
// @name         Printing helpers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Printing%20helpers.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Printing%20helpers.user.js
// @description  Better print support
// @author       Adam
// @match        https://gamersplane.com/forums/thread/*/?pageSize=10000
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    GM_addStyle(`
    #printOptions{
        font-size: 50%;
        position: relative;
        margin-left: 1rem;
        cursor: pointer;
        padding-left: 1em;
        display:inline-block;
    }
    #printOptionsToggle::before{
        content: "\\25BA";
        position: absolute;
        top:0;
        left:0;
    }
    #printOptions.open #printOptionsToggle::before{
        content: "\\25BC";
    }

    #printOptions ul{
        display:none;
    }
    #printOptions.open ul{
        display:block;
        position:absolute;
        background-color: #fff;
        padding: 1rem;
        z-index: 10;
        margin: 0;
        list-style-type:none;
    }
    #printOptions.open ul li{
        padding:0;
        margin:0;
        white-space:nowrap;
        color:#888;
        line-height: 150%;
    }
    #printOptions.open ul li.printOptSel{
        color:#090;
    }
    #printOptions.open ul li::before{
        content:"\\2716 ";
        width: 1em;
        display: inline-block;
    }
    #printOptions.open ul li.printOptSel::before{
        content:"\\2713 ";
    }

    @media print {
        .noprint,#printOptions,#page_forum_thread .postBlock .postPoint{
            display: none
        }
        .spoiler.open-print.closed>.hidden {
            display: block;
        }
        body.style-background #content>.bodyContainer:before{
            outline-color: transparent;
        }
        #page_forum_thread h1.headerbar{
            color:#000;
            margin-bottom:1rem;
        }
        h1.headerbar .ra{
            display:none;
        }
    }`);

    $(`<span id="printOptions"><span id="printOptionsToggle">Print options</span>
    <ul>
    <li class="printOptSel printOptSelClass" data-hideclass='oocText'>ooc</li>
    <li class="printOptSel printOptSelClass" data-hideclass='quote'>quote</li>
    <li class="printOptSel printOptSelClass" data-hideclass='rolls'>rolls</li>
    <li class="printOptSel printOptSelClass" data-hideclass='spoiler'>spoilers</li>
    <li class="printOptSel printOptSelClass" data-hideclass='mapLink'>battlemaps</li>
    <li class="printOptSel printOptSelClass" data-hideclass='zoommap'>zoom maps</li>
    <li class="printOpt-print-spoilers">print spoiler contents</li>
    </ul>
    </span>`).appendTo('h1.headerbar');

    var applyPrintStyles=function(){
        $('.noprint').removeClass('noprint');
        $('.open-print').removeClass('open-print');

        console.log('test');
        $('.printOptSelClass:not(.printOptSel)').each(function(){
            $('.'+$(this).data('hideclass')).addClass('noprint');
        });

        if($('.printOpt-print-spoilers').hasClass('printOptSel')){
            $('.spoiler').addClass('open-print');
        }

        //hide empty quotes
        $('.quote').each(function(){
            var checkEmpty=$('<div></div>').html($(this).html());
            $('.quotee',checkEmpty).remove();
            $('.noprint',checkEmpty).remove();
            if($('img',checkEmpty).length==0 && $.trim(checkEmpty.text())==''){
                $(this).closest('.quote').addClass('noprint');
            }
        });

        //remove empty posts
        $('.post').each(function(){
            var checkEmpty=$('<div></div>').html($(this).html());
            $('.noprint',checkEmpty).remove();
            if($('img',checkEmpty).length==0 && $.trim(checkEmpty.text())==''){
                $(this).closest('.postBlock').remove();
            }
        });
    };

    $('#printOptionsToggle').on('click',function(){$(this).closest('#printOptions').toggleClass('open');});
    $('#printOptions ul li').on('click',function(){$(this).toggleClass('printOptSel');applyPrintStyles();});
})();