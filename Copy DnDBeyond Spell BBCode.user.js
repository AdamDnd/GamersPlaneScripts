// ==UserScript==
// @name         Copy DnDBeyond Spell BBCode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Spell%20BBCode.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Spell%20BBCode.user.js
// @description  Copies DnDBeyond to the clipboard for pasting into a character sheet
// @author       You
// @match        https://www.dndbeyond.com/spells*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    $('.info').each(function(){
        $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpBBCode">'+$('.name .link',this).text()+' BBCode 📋</div>').insertAfter($(this));
    });

    $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpAllBBCode">All BBCode 📋</div>').insertBefore($('.adohand-spells'));

    var notify=function(text){
          $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;'>"+text+"<br/><small style='font-size:50%;'>Paste into your Gamers' Plane character sheet</small></div>")
          .appendTo('body')
          .fadeTo(1000,1.0, function(){
                $(this).fadeOut(1000, function(){
                    $(this).remove();
                });
          });
    };

    var getBBCode=function(copyGpBBCode,onComplete){
        var infoBlock=copyGpBBCode.prevAll('.info:first');
        var miType=infoBlock.data('type');
        var miSlug=infoBlock.data('slug');
        $.get( "/"+miType+"/"+miSlug+"/more-info", function( data ) {
            data=data.replaceAll('<strong>','[b]');
            data=data.replaceAll('</strong>','[/b]');
            var prefix=$('.spell-level',infoBlock).text().replace(/[^\d]*/g,'');
            prefix+=(prefix.length>0?'. ':'');
            var name=$('.name .link',infoBlock).text();
            var text='# '+prefix+name+'\r\n';
            var dataBlock=$(data);
            text+='[table="compact"]\r\n';
            $('.ddb-statblock-item',dataBlock).each(function(){
                var row=$(this);
                text+='[b]'+$.trim($('.ddb-statblock-item-label',row).text())+'[/b] | ';
                text+=$.trim($('.ddb-statblock-item-value',row).text().replace(/[\r\n]/g,' '))+'\r\n';
            });
            text+='[/table]\r\n';
            text+=$.trim($('.more-info-body-description',dataBlock).text());
            text=text.replace(/[ ]+/g, ' ');
            onComplete(text);
        });
    };

    var getNextBBCode=function(copyGpBBCode,bbcode){
        var infoBlock=copyGpBBCode.prevAll('.info:first');
        $('#copyNotification').text($('.name .link',infoBlock).text());
        getBBCode(copyGpBBCode,function(text){
            if(bbcode.length>0){
                bbcode+='\r\n\r\n';
            }

            bbcode+=text;
            var nextcopyGpBBCode=copyGpBBCode.nextAll('.copyGpBBCode:first');
            if(nextcopyGpBBCode.length==0){
                navigator.clipboard.writeText(bbcode).then(function() {
                    $('#copyNotification').fadeTo(1000,1.0, function(){
                        $(this).fadeOut(1000, function(){
                            $(this).remove();
                        });
                    });
                });
            } else {
                getNextBBCode(nextcopyGpBBCode,bbcode);
            }
        });
    };

    $('.listing').on('click','.copyGpBBCode',function(ev){
        getBBCode($(this),function(text){
            navigator.clipboard.writeText(text).then(function() {
                notify('Copied');
            });
        });
    });

    $('.listing-container').on('click','.copyGpAllBBCode',function(ev){
        $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;' id='copyNotification'>Copying...</div>").appendTo('body');
        getNextBBCode($('.copyGpBBCode:first'),'');
    });

})();