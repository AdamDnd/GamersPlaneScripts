// ==UserScript==
// @name         Decks
// @namespace    http://tampermonkey.net/
// @version      0.2
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Decks.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Decks.user.js
// @description  Card decks
// @author       Adam
// @match        https://gamersplane.com/forums/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    var otfDecks=function(chosenDeck,curState){
        //helpers
        /////////LCGRNG Helper
        function LCGRNG(seed) {
            //https://en.wikipedia.org/wiki/Linear_congruential_generator
            var m = 16381, a = 3007, c = 15809, state = seed;
            return {next:function() {state = (a * state + c) % m; return state;} };
        };
        //////////End LCGRNG Helper

        /////////Base64 Helper
        var Base64=(function(){
            //https://datatracker.ietf.org/doc/html/rfc4648#section-5
            var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

            var publicMethods={};
            publicMethods.toBinary= function(str,arraySize){
                var ret=[];
                for(var i=0;i<str.length;i++){
                    var nChar=base64chars.indexOf(str[i]);
                    for(var j=0;j<6;j++){
                        ret.push(nChar&(1<<j)?true:false);
                    }
                }
                //resize array
                while (ret.length > arraySize) { ret.pop(); }
                while (ret.length < arraySize) { ret.push(false); }
                return ret;
            };

            publicMethods.fromBinary= function(array){
                var ret='';
                for(var i=0;i<array.length;i+=6){
                    var nChar=0;
                    for(var j=0;j<6;j++){
                        nChar+=(array[i+j]?1:0)<<j;
                    }
                    ret+=base64chars[nChar];
                }
                return ret;
            };

            return publicMethods;
        })();
        /////////End Base64 Helper

        //////////////////////////////
        //deck functionality
        var reversible=false;
        var deck=chosenDeck;
        if(chosenDeck.cards){
            deck=chosenDeck.cards;
            reversible=(chosenDeck.reversible)?true:false;
        }
        var deckStateString=curState?curState:'', publicMethods={};

        publicMethods.draw =function(n,seed){
            var deckState=Base64.toBinary(deckStateString,deck.length);
            var rng=new LCGRNG(seed);
            var remainingCards=deck.map(function(ele,idx){return {card:ele, shufflepos:rng.next(), index:idx}}).filter(function(ele,idx){return !deckState[idx];});
            var shuffled=remainingCards.sort(function(a, b){return a.shufflepos - b.shufflepos;});
            var drawn=shuffled.slice(0,n);
            var reversed=[];
            drawn.forEach(function(ele){deckState[ele.index]=true;});
            drawn.forEach(function(ele){reversed.push(reversible && (rng.next()%2)==1);});

            return {totalCards:deck.length,
                    remainingCards:remainingCards.length-drawn.length,
                    drawnCards:drawn.map(function(ele){return ele.card;}),
                    newState:Base64.fromBinary(deckState),
                    reversed:reversed
                   };
        }

        return publicMethods;
    };

    ///GP
    GM_addStyle(`
    .otfDeckState{
        float:right;
        cursor:pointer;
    }

    .otfDeckDrawnCards{
        display: grid;
        grid-template-columns: repeat(auto-fit,150px);
        grid-auto-rows: auto;
        grid-gap: 40px;
    }
    .otfDeckDrawnCards span{
        min-height: 175px;
        text-align: center;
        font-size: 120%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Neuropol,cursive;
        background: rgb(255,255,255);
        background: linear-gradient(135deg, #ddd 0%, #eee 100%);
    }

    .otfDeckDrawnCards span.reversed,.otfDeckDrawnCards img.reversed{
        transform: scale(-1, -1);
    }

    .otfDeckDrawnCards span,
    #page_forum_thread .postContent .post .otfDeckDrawnCards img    {
        border: solid 5px #f2f2f2;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.2);
    }

    body.dark .otfDeckDrawnCards span{
        background-color:#333;
        background: linear-gradient(135deg, #333 0%, #444 100%);
    }
    body.dark .otfDeckDrawnCards *{
        border-color: #555;
    }

    .otfDeckStatus{
        border-top:solid 1px #888;
        margin-top:.5rem;
        padding-top:.2rem;
    }`);

    var gameOptions=null;
    try{gameOptions=JSON.parse($('#gameOptions').text());}catch{}
    if(gameOptions && gameOptions.decks){
        $('.postBlock').each(function(){
            var pThis=$(this);
            var seed=pThis.data('postid');
            $('.post',pThis).contents().each(function () {
                //textnode
                if (this.nodeType === 3){
                    var replacementMade=false;
                    var newText=this.nodeValue.replace(/\[draw(=\"([^"]+)\")?\s*([A-Za-z0-9\-\_]*)\](\d+)\[\/draw\]/gm,function(fullMatch,deckAttrib,deck,state,cards){
                        if(!deck){
                            deck=Object.keys(gameOptions.decks)[0];
                        }
                        var lowerdeck=deck.toLowerCase();
                        var chosenDeck=gameOptions.decks[Object.keys(gameOptions.decks).find(key => key.toLowerCase() === lowerdeck)];
                        if(chosenDeck){
                            replacementMade=true;
                            var drawnCards=(new otfDecks(chosenDeck,state)).draw(cards,seed);
                            var ret=$('<div><div class="otfDeck"><h3></h3><div class="otfDeckDrawnCards"></div><div class="otfDeckStatus"><span class="otfDeckCardCount"></span> <span class="otfDeckState"></span></div></div></div>');
                            $('h3',ret).text(deck);
                            drawnCards.drawnCards.forEach(function(ele,idx){
                                var addedCard=null;
                                if(/^http[s]?:\/\/(.)+$/gm.test(ele)){
                                    addedCard=$('<img/>').attr('src',ele).appendTo($('.otfDeckDrawnCards',ret));
                                } else {
                                    addedCard=$('<span></span>').text(ele).appendTo($('.otfDeckDrawnCards',ret));
                                }
                                if(drawnCards.reversed[idx]){
                                    addedCard.addClass('reversed');
                                }
                            });
                            $('.otfDeckCardCount',ret).text(drawnCards.remainingCards+'/'+drawnCards.totalCards);
                            $('.otfDeckState',ret).text(drawnCards.newState);
                            return ret.html();
                        }
                        return fullMatch;
                    });
                    if(replacementMade){
                        $(this).replaceWith(newText);
                    }
                }
            });
        });
    }

    $('.otfDeckState').on('click',function(){
        var pThis=$(this);
        var deckName=$('h3',pThis.closest('.otfDeck')).text();
        var curState=pThis.text();
        $('#messageTextArea').focus();
        $.markItUp({ openWith: '[draw="'+deckName+'" '+curState+']', closeWith:'[/draw]' });
        $("#messageTextArea")[0].scrollIntoView();

    });

})();