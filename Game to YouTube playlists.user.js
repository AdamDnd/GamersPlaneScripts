// ==UserScript==
// @name         Game to YouTube playlists
// @namespace    http://tampermonkey.net/
// @version      0.2
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Game%20to%20YouTube%20playlists.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Game%20to%20YouTube%20playlists.user.js
// @description  Extract YouTube links from the game threads into YouTube playlists
// @author       You
// @match        https://gamersplane.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        none
// ==/UserScript==
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    var forumsRoot=$('#fixedMenu .leftCol>li:eq(2) a.menuLink').attr('href');
    var progressDiv=null;
    var ownerDocument = document.implementation.createHTMLDocument('virtual');
    var threads=[];
    var links=[];
    var threadGroups=[];

    var addResults=function(title,linkArray){
        var playlistSize = 50;
        var playlistNumber=1;
        $('<h3></h3>').text(title).appendTo(progressDiv);
        var ul=$('<ul></ul>').appendTo(progressDiv);
        for (var i = 0; i < linkArray.length; i += playlistSize) {
            var playlist = linkArray.slice(i, i + playlistSize);
            var li=$('<li></li>').appendTo(ul);
            var playListName='Playlist '+(playlistNumber++);
            if(linkArray.length<=playlistSize){
                playListName='Playlist';
            }
            playListName+=' ('+playlist.length+' videos)';
            $('<a target="ytPlaylist"></a>').text(playListName).attr('href','http://www.youtube.com/watch_videos?video_ids='+playlist.toString()).appendTo(li);
        }
    };
    var getPosts=function(threadIndex){
        var threadUrl=threads[threadIndex].link+'?pageSize=10000';
        progressDiv.text('Reading: '+threads[threadIndex].name+'...');
        $.get(threadUrl,function(data){
            var threadHtml=$(data, ownerDocument);
            var threadGroup=null;
            $('.youtube_bb iframe',threadHtml).each(function(){
                var src=$(this).attr('src');
                var youTubeLinkMatches=[...src.matchAll(/https:\/\/www\.youtube\.com\/embed\/([^?]*)/gm)];
                if(youTubeLinkMatches.length==1 && youTubeLinkMatches[0].length==2){
                    links.push(youTubeLinkMatches[0][1]);
                    if(threadGroup==null){
                        threadGroup={name:threads[threadIndex].name,links:[]};
                        threadGroups.push(threadGroup);
                    }
                    threadGroup.links.push(youTubeLinkMatches[0][1]);
                }
            });
            if(threadIndex+1==threads.length){
                progressDiv.html('<h1>Playlists</h1>');
                addResults('Game',links);
                $('<hr/>').appendTo(progressDiv);
                for(var i=0;i<threadGroups.length;i++){
                    addResults(threadGroups[i].name,threadGroups[i].links);
                }
                $('<hr/>').appendTo(progressDiv);
            } else {
                getPosts(threadIndex+1);
            }
        });
    }

    var getThreads=function(page){
        var forumsUrl=forumsRoot+"?page="+page;
        $.get( forumsUrl, function( data ) {
            progressDiv.text('Reading threads...');
            var threadsHtml=$(data, ownerDocument);
            var threadsFound=$('.tableDiv.threadTable .sudoTable .threadInfo',threadsHtml);
            threadsFound.each(function(){
                var threadName=$('.threadTitle',$(this));
                var threadDate=$('.threadAuthor .convertTZ',$(this)).text();
                threads.push({link:threadName.attr('href'),name:threadName.text(),firstPost:new Date(threadDate)});
            });
            if(threadsFound.length==0){
                threads.sort(function(a,b){
                    return new Date(a.firstPost) - new Date(b.firstPost);
                });

                getPosts(0);
            } else {
                getThreads(page+1);
            }
        });
    };


    $('<span style="cursor:pointer;">📺</span>').prependTo($('h1.headerbar')).on('click',function(){
        $(this).hide();
        progressDiv=$('<div></div>').insertAfter($('h1.headerbar'));
        getThreads(1);
    });
})();
