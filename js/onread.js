if (!window.game) {
  window.game = {
    __________READY: function () {}
  }
}

/* USERSCRIPT DEV PACK - PUT MINIFIED CODE BEFORE SCRIPT, ADD UPGRADES @run document-start */
let _ = function (){
  !function(){if(window.game)return;let e=[],o="",t=document.documentElement,n=!1,i=(e,t)=>{for(let i of e)for(let r of i.addedNodes)"b"===r.id&&(r.innerHTML=o,n=!0)},r=new MutationObserver(i);r.observe(t,{attributes:!0,childList:!0,subtree:!0}),window.game={addUpgrade:function(e,t,i){n?document.getElementById("b").innerHTML+=` <info title="${t}">${e}</info> - <${e.toLowerCase()} level="${i}">0</${e.toLowerCase()}>`:o+=` <info title="${t}">${e}</info> - <${e.toLowerCase()} level="${i}">0</${e.toLowerCase()}>`},onReady:function(o){e.push(o)},__________READY:function(){e.forEach(e=>{e()})}}}();

  
  window.game.addUpgrade(name, dsc, lvl)
  window.game.onReady(function () {
    // Runs when all window.game methods are there; just use js console to check them dummy;
  })
}