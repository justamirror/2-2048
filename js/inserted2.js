window.gm = ((_gm) => {
  let upgradeDiv = document.querySelector('#upgrades');
  function save() {
    _gm.storageManager.setGameState(_gm.serialize())
  };
  let storage = _gm.storageManager.storage;
  class EventEmitter {
    constructor() {
      this.events = {};
    }
    on(event, f) {
      if (typeof f !== 'function') {
        return console.error(Error(
          'Passed a non function to gm.on()'
        ))
      }
      if (this.events[event] === undefined) {
        this.events[event] = [];
      }
      this.events[event].push(f);
      return f
    }
    emit(event, ...data) {
      if (this.events[event] === undefined) {
        return
      }

      for (let func of this.events[event]) {
        func(...data)
      }
    }
  }
  let gmEvents = new EventEmitter();
  let gm = window.game = new Proxy({
    score: _gm.score,
    tile: function (position, value) {
      // position.x
      // position.y

      return new Tile(position, value)
    },
    upgrades: new Proxy(window.upgrades, {
      set: function(t, p, v) {
        if (t[p] === undefined) {
          return console.warn(new Error('Cannot directly add new upgrades to game.upgrades, you must use game.addUpgrade(name, description, lvl).'));
        }
        t[p] = v;
        let ae = upgradeDiv.querySelector(p);
        if (ae) {
          ae.innerText = v;
        }

        _gm.storageManager.storage.setItem('upgrades', JSON.stringify(t));
      }
    }),
    grid: new Proxy(_gm.grid, {
      get: function(t, p) {
        t = _gm.grid;
        if (typeof t[p] !== 'function') {
          return t[p]
        }
        if (['fromState', 'insertTile', 'removeTile', 'scramble'].includes(p)) {
          return function(...args) {
            let v = t[p](...args);
            save();
            return v;
          }
        } else {
          return function(...args) { return t[p](...args) }
        }
      }
    }),
    storageManager: _gm.storageManager,
    storage: _gm.storageManager.storage,
    on: function(event, f) {
      return gmEvents.on(event, f)
    },
    interval: function(f, ms, pauseWhenPaused = true) {
      if (typeof ms === 'function') {
        if (pauseWhenPaused) {
          function timedout() {
            if (window.PAUSED()) {
              f()
            };
            setTimeout(timedout, ms());
          }
          return setTimeout(timedout, ms())
        } else {
          function timedout() {
            f()
            setTimeout(timedout, ms());
          }
          return setTimeout(timedout, ms())
        }
      } else {
        if (pauseWhenPaused) {
          return setInterval(function() {
            if (window.PAUSED()) {
              f()
            }
          }, ms)
        } else {
          return setInterval(f, ms)
        }
      }
    },
    paused: window.PAUSED,
    isOver: function() { return _gm.over },
    isWon: function() { return _gm.won },
    winningTile: _gm.winningTile,

    render: function() {
      _gm.actuate()
    },

    pointActions: new Proxy(window._____DASH_TWENTY_TWO_JUST_USE_window_dot_game_DUMBHASH, {
      set: function(t, p, v) {
        if (t[p] !== undefined) {
          return t[p] = v;
        }
        console.warn(new Error('Cannot directly set new upgrade to game.pointActions. Use game.addPointAction(name, dsc, price, onBuy).'))
      }
    }),

    addPointAction: function(name, description, price, func) {
      window._____DASH_TWENTY_TWO_JUST_USE_window_dot_game_DUMBHASH[name] = [description, price, func];
      window._____YOU_DUNB_USE_game_OBHJ(name, [description, price, func]);
    },
    addUpgrade: function(name, dsc, lvl) {
      
    }
}, {
  get: function(target, p) {
    if (p === 'score') {
      return _gm.score;
    }
    return target[p]
  },
  set: function(target, p, v) {
    let al = v - _gm.score;
    if (p === 'score') {
      if (al > 0) {
        al *= (gm.upgrades.boosterjuice + 1);
        al *= Math.floor(window.REGVALUE / 8);
        al *= Number(window.increaseSPEED);
      }
      _gm.score += al;
      _gm.actuator.updateScore(_gm.score);
      return save();
    }
    target[p] = v;
    if (p === 'upgrades') {
      window.upgrades = v;
      _gm.storageManager.storage.setItem('upgrades', JSON.stringify(v));
    } else if (p === 'winningTile') {
      _gm.winningTile = v;

    }
  }
})

function runPong() {
  if (gm.upgrades.brickbreaker > 0 && !window.__paused) {
    gm.score += gm.upgrades.quan + 1;
  }
  setTimeout(runPong, 1000 / (gm.upgrades.brickbreaker || 1))
}
runPong()


function runFactory() {
  if (gm.upgrades.pointfactory > 0 && !window.__paused) {
    gm.score += (Math.pow(2, gm.upgrades.factoryshipments) * 2) * (gm.upgrades.quan + 1);
  }
  setTimeout(runFactory, 1400 / (gm.upgrades.pointfactory || 1))
}
runFactory()


function runPortal() {
  if (gm.upgrades.portal > 0 && !window.__pause) {
    gm.score += (Math.pow(2, gm.upgrades.portal) * 4) * (gm.upgrades.quan + 1);
  }
  setTimeout(runPortal, 2000)
}
runPortal()

function calcOneQuan() {
  return Math.floor(Math.round(
    ((Math.random() * 6) + 2) + (Math.min(
      gm.upgrades.asterisk,
      3
    ) +
      Math.log(
        Math.max(
          gm.upgrades.asterisk - 2,
          1
        )
      ) *
      (Math.min(7, gm.upgrades.portal) * 5) *
      (Math.min(7, gm.upgrades.brickbreaker) * 10))
  ) *
    gm.upgrades.quan);
}
function runQuan() {
  if (gm.upgrades.quan > 0 && !window.__paused) {
    gm.score += calcOneQuan()
  }
  setTimeout(runQuan, 1000)
}
runQuan()
function setTime() {
  if (!window.__paused) {
    storage.setItem('lastTime', Date.now().toString());
  }
  setTimeout(setTime, 1000);
}
setTime()

if (!window.__paused) {
  (function calcOfflineProf(diff) {
    if (gm.upgrades.brickbreaker) {
      gm.score += (gm.upgrades.quan + 1) * Math.floor(diff / (1000 / (gm.upgrades.brickbreaker || 1)));
    }
    if (gm.upgrades.pointfactory) {
      gm.score += (Math.pow(2, gm.upgrades.factoryshipments) * 2) * (gm.upgrades.quan + 1) * Math.floor(diff / (1400 / (gm.upgrades.pointfactory || 1)));
    }
    if (gm.upgrades.portal > 0) {
      gm.score += ((Math.pow(2, gm.upgrades.portal) * 4) * (gm.upgrades.quan + 1)) * Math.floor(diff / 2000);
    }
    if (gm.upgrades.quan > 0) {
      gm.score += (calcOneQuan()) * Math.floor(diff / 1000)
    }
  })(
    (Date.now() - (Number(storage.getItem('lastTime') || (Date.now().toString()))))
  )
}

_gm.inputManager.on('move', function() {
  gmEvents.emit('move');
})


_gm.inputManager.on('ascendOrRestart', function() {
  if (_gm.over) {
    gmEvents.emit('restart');
  } else {
    gmEvents.emit('ascend');
  }
});

window._______onPAUSED.push(function() {
  gmEvents.emit('paused')
})

window._______onUNPAUSED.push(function() {
  gmEvents.emit('unpaused')
})

_gm.inputManager.on('restart', function() {
  gmEvents.emit('restart');
})

_gm.inputManager.on('move', function(...args) {
  gmEvents.emit('move', ...args);
})
})