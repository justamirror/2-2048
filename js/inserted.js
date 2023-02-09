



(function() {
  let $ = function(...args) {
    return document.querySelector(...args)
  }

  if (location.origin === 'https://2-2048.justa6.repl.co') {
    $('#beta').style.display = '';
  }
  document.querySelector('#upgrades').innerHTML += document.querySelector('#b').innerHTML;
  let pointUpgrades = {
    'scramble': [
      'Scramble: Scramble the board', 
      2000, 
      function () {
        game.grid.scramble();
        game.render();
      }
    ],
    'scrape': [
      'Scrape: Scrapes lower point cells.', 
      25000, 
      function () {
        game.grid.scrape();
        game.render();
      }
    ],
  };

  window._____DASH_TWENTY_TWO_JUST_USE_window_dot_game_DUMBHASH = pointUpgrades;
  window._____YOU_DUNB_USE_game_OBHJ = function (name, obj) {
    let elem = document.createElement('div');
    elem.innerHTML = obj[0]+' - '+obj[1].toString()+' points.';
    let buyButton = document.createElement('button');
    buyButton.id = name;
    buyButton.innerText = 'Buy';
    elem.appendChild(buyButton);
    elem.innerHTML+='<br>'
    pu_hud.appendChild(elem);
    bub[name] = document.getElementById(name);
    bub[name].onclick = function () {
      if (buyable(name)) {
        buy(name)
      }
    }
  }
  let pu_hud = $('#pointUpgrades');
  pu_hud.innerHTML = `Point actions:
<br>`;
  let bub = {};
  for (let pointUpgrade of Object.keys(pointUpgrades)) {
    _____YOU_DUNB_USE_game_OBHJ(pointUpgrade, pointUpgrades[pointUpgrade])
  }
  function buyable(name) {
    let metaData = pointUpgrades[name];
    return game.score >= metaData[1]
  }
  setInterval(function () {
    for (let pointUpgrade of Object.keys(pointUpgrades)) {
      bub[pointUpgrade].className = buyable(pointUpgrade) ? '' : 'disabled';
    }
  }, 100)
  function buy(name) {
    let metaData = pointUpgrades[name];
    game.score -= metaData[1];
    return metaData[2]();
  }
  window.breakerBEEP = new Audio('./audio/beep.ogg');
  
  let storage = new LocalStorageManager;
  let a = storage.getGameState() || { winningTile: 2048 };
  storage = storage.storage;

  let upgradesDiv = document.querySelector('#upgrades');
  let upgrades = JSON.parse(storage.getItem("upgrades") || '{}');
  window.upgrades = upgrades;
  
  window.__paused = JSON.parse(storage.getItem('paused') || 'false');
  window._______onPAUSED = [];
  window._______onUNPAUSED = [];
  window.PAUSED = function (v) {
    if (v === undefined) {
      return window.__paused;
    }
    storage.setItem('paused', JSON.stringify(v));
    window.__paused = v;
    if (v) {
      for (let f of window._______onPAUSED) {
        f()
      }
    } else {
      for (let f of window._______onUNPAUSED) {
        f()
      }
    }
  };
  let rounds = Number(storage.getItem("rounds") || '0');
  Object.defineProperty(window, 'rounds', {
    get: function () {
      return rounds
    },
    set: function (v) {
      let e = rounds = v;
      storage.setItem('rounds', String(rounds))
      return e
    },
    enumerable: true,
    configurable: true,
  });
  window.REMOVEUPGRADES = function () {
    storage.removeItem("upgrades")
    Object.keys(upgrades).forEach(function(k) {
      if (upgradesDiv.querySelector(k) === null) {
        return
      }
      upgrades[k] = 0;
      upgradesDiv.querySelector(k).innerText = '0';
    })
  }
  window.REMOVEROUNDS = function () {
    window.rounds = 0;
  }
  let childs = Array(...upgradesDiv.children).slice(1);
  
  window.UNCHECKFFS = () => {
    let baseLevel = Object.values(upgrades).reduce((a, b)=>a+b, 0);
    Object.keys(upgrades).forEach(en=>{
      let e = upgradesDiv.querySelector(en);
      if (e === null) {
        return 
      }
      e.nextElementSibling.disabled = (baseLevel < upgradeLevels[en]);
    })
    window.PAUSED(true);
    return window.oldChecked = undefined;
  }
  let upgradeLevels = {};
  window.______BAL___upgradeLVL = upgradeLevels;
  childs.forEach((e2) => {
    if (e2.tagName.toLowerCase() === 'info') {
      return
    }
    if (upgrades[e2.tagName.toLowerCase()] === undefined) {
      upgrades[e2.tagName.toLowerCase()] = 0;
    };
    upgradeLevels[e2.tagName.toLowerCase()] = Number(e2.getAttribute('level') || '0');
    e2.innerText = upgrades[e2.tagName.toLowerCase()];
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onclick = () => {
      if (window.oldChecked) {
        upgrades[window.oldChecked.previousElementSibling.tagName.toLowerCase()]--;
        window.oldChecked.previousElementSibling.innerText = upgrades[window.oldChecked.previousElementSibling.tagName.toLowerCase()];
        window.oldChecked.checked = false;
        if (window.oldChecked === checkbox) {
          return window.oldChecked = undefined;
        }
      }
      window.oldChecked = checkbox;
      if (checkbox.checked) {
        upgrades[e2.tagName.toLowerCase()]++
      }
      e2.innerText = upgrades[e2.tagName.toLowerCase()];
    };
    upgradesDiv.insertBefore(checkbox, e2.nextSibling)
  })



  
  window.winningTileValue = window.winningTile = a.winningTile;
  let wtv = $("#winningTileValue");
  let increaseSPEED = $("#increaseV");
  wtv.value = Math.log2(window.winningTile);
  let wt = $("#winningTile");
  let titleElem = $('title');
  wt.innerText = window.winningTile;
  titleElem.innerText = '2^'+String(window.winningTile);

  wtv.oninput = () => {
    window.winningTileValue = Math.pow(2, wtv.value);
    titleElem.innerText = '2^'+String(window.winningTileValue);
    wt.innerText = window.winningTileValue;
  }
  let REGVALUE = JSON.parse(storage.getItem('reggie') || window.winningTile);
  window.REGVALUE = REGVALUE;
  increaseSPEED.value = JSON.parse(storage.getItem('incp') || '2');
  window.increaseSPEED = increaseSPEED.value;
  window.ONSTART = () => {
    window.increaseSPEED = increaseSPEED.value;
    storage.setItem('incp', JSON.stringify(increaseSPEED.value));
    REGVALUE = window.winningTileValue;
    window.REGVALUE = REGVALUE;
    storage.setItem('reggie', JSON.stringify(REGVALUE));
  }
  window.REG = () => {
    if (window.rounds > 0) {
      if (window.increaseSPEED == 1){
        window.winningTile = window.winningTile*2
      } else if (window.increaseSPEED == 2) {
        window.winningTile = REGVALUE*Math.pow(2, Math.pow(2, Math.floor(window.rounds/2)));
      } else if (window.increaseSPEED == 3) {
        window.winningTile = REGVALUE*Math.pow(2, Math.pow(2, window.rounds));
      }
    } else {
      window.winningTile = window.winningTileValue
    }
    wtv.value = Math.log2(window.winningTile);
    wt.innerText = window.winningTile;
  }
  window.___SETG = (v) => {
    window.winningTile = v;
    wtv.value = Math.log2(window.winningTile);
    wt.innerText = window.winningTile;
  }


  window.breaking = false;

  return upgrades
})()