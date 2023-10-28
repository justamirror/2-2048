/* USERSCRIPT DEV PACK - PUT MINIFIED CODE BEFORE SCRIPT, ADD UPGRADES @run document-start and grant unsafeWindow */
let e=function (){let game=unsafeWindow.game;
  console.log("Game object is good!", game)
};(function(){let r=new MutationObserver(()=>{if(unsafeWindow.game)e()});r.observe(document,{attributes:!0,childList:!0,subtree:!0})})()