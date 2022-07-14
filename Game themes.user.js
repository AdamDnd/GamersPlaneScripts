// ==UserScript==
// @name         Game theme
// @namespace    http://tampermonkey.net/
// @version      0.14
// @updateURL    https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Game%20themes.user.js
// @downloadURL  https://github.com/AdamDnd/GamersPlaneScripts/raw/main/Game%20themes.user.js
// @description  Add styling to character sheets
// @author       Adam
// @match        https://gamersplane.com/characters/custom/*
// @match        https://gamersplane.com/forums/thread/*
// @match        https://gamersplane.com/forums/*
// @match        https://gamersplane.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersplane.com
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

var themes={
// fantasy style
fantasy:`
h1.customChar,
.customChar h2.hbDark{
    background-color:transparent;
    margin-left:0;
    margin-right:0;
    font-family:'IM Fell English',serif;
    color: #832D1B;
    font-variant: small-caps;
    font-size:2em;
}
.customChar h2.hbDark:before{
    display:none;
}

.customChar h2.hbDark:after{
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    top: auto;
    background-color: #832D1B;
}

.customChar .bbTable.bbTable-ht,
.customChar .bbTable.bbTable-htl,
.customChar .bbTable.bbTableRolls,
.customChar .bbTable.bbTableStats{
    background:#F9F3D8 url(https://cdn.pixabay.com/photo/2015/12/03/08/50/paper-1074131_960_720.jpg);
}

.customChar .bbTable.bbTable-ht:before,
.customChar .bbTable.bbTable-htl:before,
.customChar .bbTable.bbTableRolls:before,
.customChar .bbTable.bbTableStats:before,
.customChar .bbTable.bbTable-ht:after,
.customChar .bbTable.bbTable-htl:after,
.customChar .bbTable.bbTableRolls:after,
.customChar .bbTable.bbTableStats:after{
    content: "";
    display: table-caption;
    background: url(https://www.dndbeyond.com/content/1-0-2056-0/skins/waterdeep/images/mon-summary/stat-bar-book.png) center;
    background-size: 100% 100%;
    height: 6px;
}

.customChar .bbTable.bbTable-ht:after,
.customChar .bbTable.bbTable-htl:after,
.customChar .bbTable.bbTableRolls:after,
.customChar .bbTable.bbTableStats:after{
    caption-side:bottom;
}

.customChar .bbTable.bbTable-ht tr:first-of-type td,
.customChar .bbTable.bbTable-htl tr:first-of-type td,
.customChar .bbTable.bbTableRolls tr:first-of-type td,
.customChar .bbTable.bbTableStats tr:first-of-type td{
    background-color:transparent;
    font-family:'IM Fell English',serif;
    font-weight:bold;
    padding-top:6px;
}

.customChar .bbTable.bbTable-ht tr td,
.customChar .bbTable.bbTable-htl tr td,
.customChar .bbTable.bbTableRolls tr td,
.customChar .bbTable.bbTableStats tr td{
    color: #822000;
    font-variant: small-caps;
}


.customChar .bbTable.bbTableRolls tr{
    border-bottom-style:none;
}

.customChar .abilityName{
    font-variant: small-caps;
}

.customChar .ability_notesLink:before{
    color: #832D1B;
}

.customChar input[type="checkbox"] {
    filter: sepia(100%) brightness(70%) hue-rotate(320deg) saturate(60%) contrast(300%);
}

.customChar .abilityNotes.notes{
    background:#F9F3D8 url(https://cdn.pixabay.com/photo/2015/12/03/08/50/paper-1074131_960_720.jpg);
    border-style:none;
    padding:.5rem;
    color:#333;
}

.headerbar:before{
    display:none;
}

.headerbar:after{
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    top: auto;
    background-color:#333;
}

.fancyButton:before,
.fancyButton:after,
.trapezoid.redTrapezoid:before,
.trapezoid.redTrapezoid:after
{
    left: 0;
    width: 100%;
    height: 4px;
}

.fancyButton:before,
.trapezoid.redTrapezoid:before{
    top: 0;
}

.fancyButton:after,
.trapezoid.redTrapezoid:after{
    bottom: 0;
    top:auto;
}


button.fancyButton,
button.fancyButton:active,
button.fancyButton:visited,
a.fancyButton,
a.fancyButton:active,
a.fancyButton:visited,
.trapezoid.redTrapezoid{
    margin:0 10px;
    font-family:'IM Fell English',serif;
    font-variant: small-caps;
    padding:4px 10px;
    background-color: transparent;
    color: #a71300;
    border-left: solid 1px;
    border-right: solid 1px;
}

h1.headerbar, h2.headerbar, h3.headerbar, h4.headerbar{
    background-color:transparent;
    color:#333;
    font-family:'IM Fell English',serif;
    font-variant: small-caps;
}

.breadcrumbs,
#breadcrumbs{
    font-family: 'IM Fell English',serif;
    font-variant: small-caps;
    font-weight: bold;
}

#page_forum_thread .postHeader {
    border-width:3px;
    border-radius: 0 0 500% 0/0 0 50% 0;
}

#page_forum_thread .postHeader .subject{
    font-family: 'IM Fell English',serif;
    font-variant: small-caps;
}

#page_forum_thread .postContent {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2x;
    border-radius: 2px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%), 0 0 2rem #D3C3AD inset;
    background: #f8f8f8;
    border-width:0;
}

.postNames{
    font-family: 'IM Fell English',serif;
    font-variant: small-caps;
}

#page_forum_thread .postPoint,
#page_forum_thread .postBlock .postContent:after,
#page_forum_thread .postBlock .postContent:before{
    display:none;
}

#charSheetRoller h3.charName{
    font-family: 'IM Fell English',serif;
    font-variant: small-caps;
}

div.headerbar{
background-color:transparent;
color:inherit;
}


body.dark h1.headerbar,body.dark h2.headerbar, body.dark h3.headerbar, body.dark h4.headerbar{
color:#D3C3AD;
}

body.dark .headerbar:after{
    background-color:#D3C3AD;
}

body.dark #page_forum_thread .postContent {
    box-shadow: 0 0 5px rgb(0 0 0 / 20%), 0 0 2rem #51493E inset;
}

body.dark button.fancyButton,
body.dark a.fancyButton,
body.dark a.fancyButton:active,
body.dark a.fancyButton:visited,
body.dark .trapezoid.redTrapezoid{
    color: #c54;
}

body.dark button.fancyButton:after,
body.dark button.fancyButton:before{
    background-color: #c54;
}
`,

// scifi style
scifi:`
.headerbar:before,
.headerbar:after,
.fancyButton.hbDark:after,
.fancyButton.hbDark:before,
.headerbar.hbDark:after,
.headerbar.hbDark:before {
    background-color:#013135;
}

h1.headerbar, h2.headerbar, h3.headerbar, h4.headerbar{
    background: radial-gradient(circle at bottom, #01959F, #013135);
    font-weight:normal;
    color:#02F9FF;
    text-shadow:0 0 5px #fff;
}

div.headerbar{
    background: radial-gradient(circle at bottom, #01959F, #013135);
}

.fancyButton:after, .headerbar:after {
    clip-path: polygon(0% 0%,0% 100%,50% 100%,100% 50%,100% 0%);
}

.fancyButton:before, .headerbar:before {
    clip-path: polygon(100% 100%,0% 100%,0% 50%,50% 0%,100% 0%);
}

button.fancyButton,
button.fancyButton:active,
button.fancyButton:visited,
a.fancyButton,
a.fancyButton:active,
a.fancyButton:visited,
.trapezoid.redTrapezoid,
.breadcrumbs,
#breadcrumbs,
#page_forum_thread .postHeader .subject,
.postNames,
.rollForChar{
    font-family: Neuropol;
}

#page_forum_thread .postContent{
    border-radius:0;
    box-shadow:0 0 8px #01959F;
}

.customChar .abilityNotes.notes{
    background: radial-gradient(circle at bottom, #01959F, #013135);
    color:#02F9FF;
    border-radius:0;
    border-color:#01959F;
}

`,
// creepy style
creepy:`
@import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger&display=swap');


.headerbar:after{
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    top: auto;
    background-color:#800 !important;
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="gpRandomnessSvg"><feTurbulence x="0" y="0" baseFrequency="0.006" type="fractalNoise" numOctaves="5"></feTurbulence><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>#gpRandomnessSvg');
}

.headerbar:before{
    display:none;
}

.fancyButton:before,
.fancyButton:after,
.trapezoid.redTrapezoid:before,
.trapezoid.redTrapezoid:after
{
    left: 0;
    width: 100%;
    height: 4px;
}

.fancyButton:before,
.trapezoid.redTrapezoid:before{
    top: 0;
}

.fancyButton:after,
.trapezoid.redTrapezoid:after{
    bottom: 0;
    top:auto;
}


button.fancyButton,
button.fancyButton:active,
button.fancyButton:visited,
a.fancyButton,
a.fancyButton:active,
a.fancyButton:visited,
.trapezoid.redTrapezoid{
    margin:0 10px;
    font-family:'Jolly Lodger',serif;
    font-variant: small-caps;
    padding:4px 10px;
    background-color: transparent;
    color: #a71300;
    border-left: solid 1px;
    border-right: solid 1px;
}

h1.headerbar, h2.headerbar, h3.headerbar, h4.headerbar{
    background-color:transparent;
    color:#333;
    font-family:'Jolly Lodger',serif;
}

.breadcrumbs,
#breadcrumbs{
    font-family: 'Jolly Lodger',serif;
    font-size:120%;
}

#page_forum_thread .postHeader {
    border-width:3px;
    border-radius: 0 0 500% 0/0 0 50% 0;
}

#page_forum_thread .postHeader .subject{
    font-family: 'Jolly Lodger',serif;
    font-weight:normal;
    font-size:130%;
}

#page_forum_thread .postContent {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2x;
    border-radius: 2px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%), 0 0 2rem #D3C3AD inset;
    background: #f8f8f8;
    border-width:0;
}

#page_forum_thread .postBlock{
    position:relative;
}


.postBlock:nth-child(3):after,
.postBlock:nth-child(13):after,
.postBlock:nth-child(19):after{
    position:absolute;
    content:' ';
    right: 0;
    left:0;
    height:40px;
    width:100%;
    top:0;
}

.postBlock:nth-child(3):after{
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="gpRandomnessSvg"><feTurbulence x="0" y="0" baseFrequency="0.17" type="fractalNoise" numOctaves="5"></feTurbulence><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>#gpRandomnessSvg');
    background: radial-gradient(circle at top center, #000 0, transparent 40px);
}

.postBlock:nth-child(13):after{
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="gpRandomnessSvg"><feTurbulence x="0" y="0" baseFrequency="0.13" type="fractalNoise" numOctaves="5"></feTurbulence><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>#gpRandomnessSvg');
    background: radial-gradient(circle at top right, #880 0, transparent 50px);
}

.postBlock:nth-child(19):after{
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="gpRandomnessSvg"><feTurbulence x="0" y="0" baseFrequency="0.16" type="fractalNoise" numOctaves="5"></feTurbulence><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>#gpRandomnessSvg');
    background: radial-gradient(circle at top center, #800 0, transparent 80px);
}


.postNames{
    font-family: 'Jolly Lodger',serif;
    font-size:130%;
}

#page_forum_thread .posterDetails .charName, #page_forum_thread .posterDetails .posterName
{
    font-weight:normal;
}


#page_forum_thread .postPoint,
#page_forum_thread .postBlock .postContent:after,
#page_forum_thread .postBlock .postContent:before{
    display:none;
}

#charSheetRoller h3.charName{
    font-family: 'Jolly Lodger',serif;
    font-variant: small-caps;
}

div.headerbar{
background-color:transparent;
    color:inherit;
}


body.dark h1.headerbar,body.dark h2.headerbar, body.dark h3.headerbar, body.dark h4.headerbar{
    color:#D3C3AD;
}

body.dark #page_forum_thread .postContent {
    box-shadow: 0 0 5px rgb(0 0 0 / 20%), 0 0 2rem #51493E inset;
}

body.dark button.fancyButton,
body.dark a.fancyButton,
body.dark a.fancyButton:active,
body.dark a.fancyButton:visited,
body.dark .trapezoid.redTrapezoid{
    color: #c54;
}

body.dark button.fancyButton:after,
body.dark button.fancyButton:before{
    background-color: #c54;
}

.ra-quill-ink:before {
    content: "\\e927";
}

.ra.forum-root-2:before,
.ra-d6:before {
    content: "\\eaa2";
}

`
};

    console.log("Applying character themes");

    var styleJson=$.trim($('.style').text().replace(/<br\s*[\/]?>/gi,'\n'));
    var styleObj=null;
    try{
        styleObj=JSON.parse(styleJson);
    }catch(e){}

    if(!styleObj){
        try{
            styleObj=JSON.parse($('#gameOptions').html());
        }catch(e){}
    }

    if(styleObj && styleObj.theme){
        if(styleObj.theme.toLowerCase() in themes){
            GM_addStyle(themes[styleObj.theme.toLowerCase()]);
        };
    }
})();
