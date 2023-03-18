// ==UserScript==
// @name         DnDB BBCode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Spell%20BBCode.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Spell%20BBCode.user.js
// @description  Copies DnDBeyond to the clipboard for pasting into a character sheet
// @author       Adam
// @match        https://www.dndbeyond.com/feats*
// @match        https://www.dndbeyond.com/equipment*
// @match        https://www.dndbeyond.com/magic-items*
// @match        https://www.dndbeyond.com/backgrounds*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    //Add a BBCode link under each item in the list. Note that DnDB has two different styles for this, some use li between the items
    $('ul.listing li .list-row,ul.listing .info').each(function(){
        $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpBBCode">'+$('.list-row-name .link,.item-name .link',this).text()+' BBCode 📋</div>').insertAfter($(this));
    });

    //Add a copy all after either .list-column-header or .adohand
    $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpAllBBCode">All BBCode 📋</div>').insertBefore($('.list-column-header,.adohand'));

    //display a message on the screen before fading out
    var notify=function(text){
          $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;'>"+text+"<br/><small style='font-size:50%;'>Paste into your Gamers' Plane character sheet</small></div>")
          .appendTo('body')
          .fadeTo(1000,1.0, function(){
                $(this).fadeOut(1000, function(){
                    $(this).remove();
                });
          });
    };

    //given a single copyBBCode link get the information, then fire onComplete with the text we received
    var getBBCode=function(copyGpBBCode,onComplete){
        var infoBlock=copyGpBBCode.prevAll('.list-row:first,.info:first');
        var miType=infoBlock.data('type');
        var miSlug=infoBlock.data('slug');
        var getUrl="/"+miType+"/"+miSlug+"/more-info";
        //equipment uses a different format for this and the path is stored on the data url
        if(!miSlug || !miType){
            getUrl=infoBlock.data('url');
        }

        //get the information from DnDB
        $.get( getUrl, function( data ) {
            //get the name of the item we selected for the heading
            var name=$.trim($('.list-row-name .link,.item-name .link',infoBlock).text());
            var text='# '+name+'\r\n';

            //Create a html block containing the data, we'll then convert html tags to BBCode in-place
            //We'll use [CRNL] to indicate newlines
            var dummyBlock=$('<div></div>')
            $(data).clone().appendTo(dummyBlock);

            //Remove gumpf
            $('.button',dummyBlock).remove();
            $('.more-info-footer-tags',dummyBlock).remove();

            //Convert tables
            $('<div>[CRNL][table="compact ht"]</div>').insertBefore($('table',dummyBlock));
            $('<div>[CRNL][/table][CRNL]</div>').insertAfter($('table',dummyBlock));
            $('table tr',dummyBlock).each(function(){
                $('<span> | </span>').prependTo($('td:not(:first()),th:not(:first())',this));
                $('<span>[CRNL]</span>').prependTo($('td:first(),th:first()',this));
            });

            //common html
            $('<span>[b]</span>').prependTo($('strong',dummyBlock));
            $('<span>[/b]</span>').appendTo($('strong',dummyBlock));
            $('<span>[i]</span>').prependTo($('em',dummyBlock));
            $('<span>[/i]</span>').appendTo($('em',dummyBlock));
            $('<span>[CRNL]</span>').prependTo($('br',dummyBlock));
            $('<span>[CRNL]</span>').appendTo($('p',dummyBlock));

            //lists
            $('<span>[CRNL]</span>').prependTo($('ul',dummyBlock));
            $('<span>* </span>').prependTo($('li',dummyBlock));
            $('<span>[CRNL]</span>').appendTo($('li',dummyBlock));
            $('<span>[CRNL]</span>').prependTo($('dl',dummyBlock));
            $('<span>* </span>').prependTo($('dt',dummyBlock));
            $('<span>[CRNL]</span>').appendTo($('dt',dummyBlock));

            //headings
            $('<span>[CRNL][size="120"][b]</span>').prependTo($('h5',dummyBlock));
            $('<span>[/b][/size][CRNL]</span>').appendTo($('h5',dummyBlock));

            //Add a CRNL to all top level children
            $('<span>[CRNL]</span>').prependTo(dummyBlock.children());

            //We now get the text of the HTML block
            var body=dummyBlock.text();

            //convert multiple concurrent spaces to single spaces
            body=body.replace(/[\s]+/g, ' ');

            //convert those [CRNL] temporary tags to newlines
            body=body.replaceAll('[CRNL]', '\r\n');

            //remove duplicated newlines
            body=body.replaceAll('\r\n\r\n', '\r\n');

            //if we have leading whitespace on a line, remove it
            body=body.replace(/^[\s]+/gm, '');
            text+=$.trim(body);
            onComplete(text);
        });
    };

    //used when getting multiple items. copyGpBBCode is the current item, bbcode is the code we've received until now
    var getNextBBCode=function(copyGpBBCode,bbcode){
        //the the block this belongs to
        var infoBlock=copyGpBBCode.prevAll('.list-row:first,.info:first');

        //get the name of this item and display it
        $('#copyNotification').text($('.list-row-name .link,.item-name .link',infoBlock).text());

        //get the bbCode for this item
        getBBCode(copyGpBBCode,function(text){

            //if we already have bbcode (not the first item) then give the next one some breathing room
            if(bbcode.length>0){
                bbcode+='\r\n\r\n';
            }

            bbcode+=text;

            //get the next item
            var nextcopyGpBBCode=copyGpBBCode.nextAll('.copyGpBBCode:first')
            if(copyGpBBCode.closest('ul.listing li').length==1) {
                //somethimes we'll be in an li and will need to go up a level
                nextcopyGpBBCode=$('.copyGpBBCode',copyGpBBCode.parent().nextAll().first());
            }

            if(nextcopyGpBBCode.length==0){
                //no more items? Put the ones we captured on the clipboard and fade out the notifier
                navigator.clipboard.writeText(bbcode).then(function() {
                    $('#copyNotification').fadeTo(1000,1.0, function() {
                        $(this).fadeOut(1000, function(){
                            $(this).remove();
                        });
                    });
                });
            } else {
                //there are more items to get. Get the next one
                getNextBBCode(nextcopyGpBBCode,bbcode);
            }
        });
    };

    //The user has selected to copy a single item
    $('.listing').on('click','.copyGpBBCode',function(ev){
        getBBCode($(this),function(text){
            navigator.clipboard.writeText(text).then(function() {
                notify('Copied');
            });
        });
    });

    //The user has selected to copy multiple items. Stick a notifier div on the screen, get the first item and start copying
    $('.listing-container').on('click','.copyGpAllBBCode',function(ev){
        $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;' id='copyNotification'>Copying...</div>").appendTo('body');
        getNextBBCode($('.copyGpBBCode:first'),'');
    });
})();