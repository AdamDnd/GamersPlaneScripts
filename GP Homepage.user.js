// ==UserScript==
// @name         GP Homepage
// @namespace    http://tampermonkey.net/
// @version      0.33
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/GP%20Homepage.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/GP%20Homepage.user.js
// @description  Format bookmarked games section
// @author       Adam
// @match        https://gamersplane.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $, moment, API_HOST */

(function() {
    'use strict';

    moment.lang('en', {calendar: {lastDay: '[Yesterday ] HH:mm', sameDay: '[Today ] HH:mm', nextDay: '[Tomorrow ] HH:mm', lastWeek: '[last] dddd HH:mm', nextWeek: 'dddd [at] HH:mm', sameElse: 'D MMM HH:mm'}});

    GM_addStyle('.hilightGame:not(.snoozed){background-color:#ffffdd;} .hilightGame:not(.snoozed) .td.lastPost a.username{font-weight:bold;} #yourGames .td.name {white-space: nowrap;}');
    GM_addStyle('body.dark .hilightGame:not(.snoozed){background-color:#3e0700;}');
    GM_addStyle('.congratsList{margin: 1px 20px 0.5rem 20px;background-color: #eee;padding: 1rem;color: #000;}');
    GM_addStyle('body.dark .congratsList{color: #fff;background-color: #37393f;}');
    GM_addStyle('#yourGames .ra-hourglass{color:#888;cursor:pointer;} #yourGames .snoozed .ra-hourglass{color:#333;} body.dark #yourGames .snoozed .ra-hourglass{color:#c54;}');

    $('#yourGames:eq(0) .tr .td.name').on('click','.ra-hourglass',function(){
        var pThis=$(this);
        var dt=pThis.data('snoozedt');
        var key=pThis.data('snoozekey');
        if(pThis.closest('.tr').toggleClass('snoozed').hasClass('snoozed')){
            localStorage.setItem(key,dt);
        } else {
            localStorage.removeItem(key);
        }
    });

    $.ajax({type: 'post',url: API_HOST +'/users/getCurrentUser',xhrFields: {withCredentials: true},data:{},
            success:function (data) {
                if(data && data.userID){
                    //Highlight bookmarked games where I wasn't the last to post
                    $('#yourGames:eq(0) .tr:not(.favGame):not(:has(.td.lastPost a.username[href="/user/'+data.userID+'/"]))').addClass('hilightGame');

                    //snoozing
                    $('#yourGames:eq(0) .tr.hilightGame:has(.td.name a):not(.favGame)').each(function(){
                        var pThis=$(this);
                        var dt=moment($('.td.lastPost .convertTZ',pThis).text(),'MMM D, YYYY h:mm a').toDate().getTime();
                        var fname=$('.td.name a',pThis)
                        var key='snooze-'+$('.td.name a',pThis).attr('href');
                        $('<i class="ra ra-hourglass"></i>').prependTo($('.td.name',pThis)).data('snoozedt',dt).data('snoozekey',key);
                        console.log(dt);
                        if(localStorage.getItem(key)==dt){
                            pThis.addClass('snoozed');
                        }
                    });

                    var congratulations=[];
                    var dtJoined=new Date(data.joinDate);
                    var dtNowUtc=new Date();
                    if(dtJoined.getDate()==dtNowUtc.getUTCDate() && dtJoined.getMonth()==dtNowUtc.getUTCMonth()){
                        var yDiff=(dtNowUtc.getUTCFullYear()-dtJoined.getFullYear());
                        if(yDiff>0){
                            congratulations.push('🎂 You joined '+yDiff+' year'+(yDiff>1?'s':'')+' ago.  Happy GP anniversary!');
                       }
                    }
                    $.ajax({type: 'post',url: API_HOST +'/users/stats',xhrFields: {withCredentials: true},data:{userID:data.userID},
                            success:function (data) {
                                var checkForSpecialNumbers=function(val,valText){
                                    if(val){
                                        if(val%10000==0){
                                            congratulations.push("💎 You've made "+val+' '+valText+'!');
                                        }
                                        else if(val%5000==0){
                                            congratulations.push("🥇 You've made "+val+' '+valText+'!');
                                        }
                                        else if((val%1000==0)&&(val<5000)){
                                            congratulations.push("🏆 You've made "+val+' '+valText+'!');
                                        }
                                        else if(val==500){
                                            congratulations.push("😎 You've made "+val+' '+valText+'!');
                                        }
                                        else if(val==100){
                                            congratulations.push("⭐ You've made "+val+' '+valText+'!');
                                        }
                                    }
                                };
                                if(data.posts){
                                    checkForSpecialNumbers(data.posts.communityCount,'community posts');
                                    checkForSpecialNumbers(data.posts.gameCount,'game posts');
                                    if(data.posts.communityCount>0 && data.posts.gameCount>0){
                                        checkForSpecialNumbers(data.posts.count,'posts');
                                    }
                                }
                            },
                            complete:function(data){
                                if(congratulations.length>0){
                                    var congrats=$('.congratsList',$('<div class="col-1"><h2 class="headerbar notificationsheaderbar"><i class="ra ra-diamond"></i> Congratulations</h2><div class="congratsList"></div></div>').prependTo($('#page_home')));
                                    for(var i=0;i<congratulations.length;i++){
                                        $('<h3></h3>').text(congratulations[i]).appendTo(congrats);
                                    }
                                }
                            }
                           });
                }
            }
        });

    //change last posting date to human readable
    $('.convertTZ').each(function(){
        $(this).text(moment($(this).text(),'MMM D, YYYY h:mm a').calendar(null, {sameDay: '[Today]',nextWeek: 'dddd',lastDay: '[Yesterday]',lastWeek: '[Last] dddd',sameElse: 'MMM D, YYYY h:mm a'}));
    });

})();