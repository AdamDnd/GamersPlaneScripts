// ==UserScript==
// @name         Copy DnDBeyond Monster BBCode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Monster%20BBCode.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Copy%20DnDBeyond%20Monster%20BBCode.user.js
// @description  Copy monster snippet in BBCode format
// @author       Adam
// @match        https://www.dndbeyond.com/monsters*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    $('.info').each(function(){
        $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpBBCode"><span>'+$('.name .link',this).text()+' BBCode 📋<div>').insertAfter($(this));
    });

    var notify=function(text){
          $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;'>"+text+"<br/><small style='font-size:50%;'>Paste into Gamers' Plane</small></div>")
          .appendTo('body')
          .fadeTo(1000,1.0, function(){
                $(this).fadeOut(1000, function(){
                    $(this).remove();
                });
          });
    };

    var copyDetails=function(data,image){
        data=data.replaceAll('<strong>','[b]');
        data=data.replaceAll('</strong>','[/b]');
        var dataBlock=$(data);
        var name=$.trim($('.mon-stat-block__name',dataBlock).text());
        var text='# '+name+'\r\n';
        text+='[f=small]'+$.trim($('.mon-stat-block__meta',dataBlock).text())+'[/f]\r\n';
        if(image && image.length && image.attr('href')){
            text+=name+' | '+image.attr('href')+'\r\n';
        }

        text+='[table="compact"]\r\n';
        $('.mon-stat-block__attribute',dataBlock).each(function(){
            var row=$(this);
            text+='[b]'+$.trim($('.mon-stat-block__attribute-label',row).text())+'[/b] | ';
            text+='[_='+$.trim($('.mon-stat-block__attribute-data-value',row).text().replace(/[\r\n]/g,' '))+']'+(' '+$('.mon-stat-block__attribute-data-extra',row).text().replace(/[\r\n]/g,' ')).replace(/\s+$/, "")+'\r\n';
        });
        text+='[/table]\r\n';

        var headingRow='';
        var statRow='';
        var bonusRow='';
        $('.ability-block__stat',dataBlock).each(function(){
            var row=$(this);
            var statName=$('.ability-block__heading',row).text();
            headingRow+=' | '+statName;
            statRow+=' | [_mDnDB'+statName+'='+$('.ability-block__score',row).text()+']';
            bonusRow+=' | [_$=+d20bonus(mDnDB'+statName+')]';
        });
        text+='[table="rolls d20 dnd5e"]\r\n'+headingRow+'\r\n'+statRow+'\r\n'+bonusRow+'\r\n[/table]\r\n';

        $('.mon-stat-block__tidbit',dataBlock).each(function(){
            var row=$(this);
            text+='[b]'+$.trim($('.mon-stat-block__tidbit-label',row).text())+'[/b] '+$.trim($('.mon-stat-block__tidbit-data',row).text())+'\r\n';
        });

        var descBlockText='';
        $('.mon-stat-block__description-block',dataBlock).each(function(){
            var descriptionBlock=$(this);
            var heading=$.trim($('.mon-stat-block__description-block-heading',descriptionBlock).text());
            if(heading){
                descBlockText+='\r\n[linebreak]\r\n[f=h3]'+heading+'[/f]\r\n';
            }
            descBlockText+=$.trim($('.mon-stat-block__description-block-content',descriptionBlock).text());
        });
        descBlockText=descBlockText.replace(/(\d+)\//gm,'[_=$1/$1] $1/');
        descBlockText=descBlockText.replace(/^[ ]+\[b\]/gm, '[b]');
        descBlockText=descBlockText.replace(/^\[b\]/gm, '\r\n[b]');
        text+=descBlockText+'\r\n';

        var monsterDetails=$('.mon-details__description-block-content',dataBlock);
        if(monsterDetails.length){
            var monsterDetailshtml=monsterDetails.html();
            monsterDetailshtml=monsterDetailshtml.replaceAll('<h2>','[f=h3]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('</h2>','[/f]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('<h3>','[b]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('</h3>','[/b]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('<h4>','[b]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('</h4>','[/b]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('<em>','[i]');
            monsterDetailshtml=monsterDetailshtml.replaceAll('</em>','[/i]');
            monsterDetails.html(monsterDetailshtml);
            text+=$.trim(monsterDetails.text())+'\r\n';
        }

        text=text.replace(/[ ]+/g, ' ');

        navigator.clipboard.writeText(text).then(function() {
            notify('Copied');
        });
    };

    if($('.monster-details').length==1){
        $('<div style="text-align:right;cursor:pointer;color:#888;" class="copyGpBBCode"><span>'+$('.name .link',this).text()+' BBCode 📋<div>').appendTo($('.page-heading')).on('click',function(){
            var detailsHtml=$('.monster-details .detail-content').html();
            var image=$('.details-aside .image a');
            copyDetails(detailsHtml,image);
        });
    }

    $('.listing').on('click','.copyGpBBCode',function(ev){
        var infoBlock=$(this).prevAll('.info:first');
        var miType=infoBlock.data('type');
        var miSlug=infoBlock.data('slug');
        var image=$('.monster-icon a',infoBlock);
        $.get( "/"+miType+"/"+miSlug+"/more-info", function( data ) {
            copyDetails(data,image);
        });
    });})();