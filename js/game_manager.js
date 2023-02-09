function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size = size; // Size of the grid
  this.inputManager = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator = new Actuator;

  this.startTiles = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  let self = this;
  this.inputManager.on("ascendOrRestart", function() {
    if (self.won) {
      return self.ascend()
    }
    self.restart()
  });

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function() {
  window.REMOVEUPGRADES();
  window.REMOVEROUNDS();
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// ASCEND the game
GameManager.prototype.ascend = function() {
  this.storageManager.storage.setItem("upgrades", JSON.stringify(window.upgrades));
  window.rounds++;
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  
  this.setup(this.score);
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function() {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function() {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function(score) { 
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid = new Grid(previousState.grid.size,
      previousState.grid.cells); // Reload grid
    this.score = previousState.score;
    this.over = previousState.over;
    this.won = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
    this.winningTile = previousState.winningTile;
  } else {
    window.ONSTART();
    this.grid = new Grid(this.size);
    this.score = score || 0;
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    window.REG();
    this.winningTile = window.winningTile;

    // Add the initial tiles
    this.addStartTiles();
  }

  document.querySelector('#winningTile2').innerText = this.winningTile;
  if (!this.won) {
    document.querySelectorAll('input[type="checkbox"]').forEach(function(e) { e.style.display = "none" });
  }
  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function() {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function() {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    if ((Math.random() * (Math.log(window.upgrades.asterisk + 1) * 2)) > 1) {
      value = '*';
    }
    if ((Math.random() < 0.1*window.upgrades.boosterjuice)) {
      value = 8;
    }
    if ((Math.random() < 0.1*window.upgrades.portal)) {
      value = '🍪';
    }
    if ((Math.random() < 0.3 & isNaN(value))) {
      value = Math.random() < 0.9 ? 2 : 4;
      if ((Math.random() < 0.1*window.upgrades.boosterjuice)) {
        value = 8;
      }
    }
    if (value === 8 && Math.random() < 0.3) {
      value = 4;
    }
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function() {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
    document.querySelector('.retry-button').innerText = 'Retry';
    document.querySelector('.retry-button').className = 'retry-button';
  } else {
    this.storageManager.setGameState(this.serialize());
    document.querySelector('.retry-button').innerText = 'Ascend';
    document.querySelector('.retry-button').className = 'retry-button disabled';
  }

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won,
    bestScore: this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function() {
  return {
    grid: this.grid.serialize(),
    score: this.score,
    over: this.over,
    won: this.won,
    keepPlaying: this.keepPlaying,
    winningTile: this.winningTile
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function() {
  this.grid.eachCell(function(x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function(tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function(direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  let alreadyRAND = false;
  traversals.x.forEach(function(x) {
    traversals.y.forEach(function(y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && ((next.value === tile.value || [next.value, tile.value].includes('*') || [next.value, tile.value].includes('🍪'))) && !next.mergedFrom) {
          if (!alreadyRAND) {
            let n = document.querySelector('#pongNotif').style.display = Math.random() < (0.1 * game.upgrades.brickbreaker) ? 'block' : 'none';
  window.breaking = n === 'block'
            alreadyRAND = true;
          }
          if (next.value === '*') {
            [next.value, tile.value] = [tile.value, next.value];
          }
          let dep = 1;
          if (tile.value === '*') {
            tile.value = next.value;
            dep = 4;
          }
          if (tile.value === '🍪') {
            if (next.value === '🍪') {
              var merged = new Tile(positions.next, 2);
              self.score += 2*(upgrades.boosterjuice+1) * Math.floor(window.REGVALUE/8) * Number(window.increaseSPEED);
            } else {
              self.score += next.value + Math.ceil((Math.random()*10)*next.value)*(upgrades.boosterjuice+1) * Math.floor(window.REGVALUE/8) * Number(window.increaseSPEED);
              var merged = new Tile(positions.next, '🍪');
            }
          } else {
            var merged = new Tile(positions.next, tile.value * 2);
            self.score += Math.floor(merged.value/dep)*(upgrades.boosterjuice+1) * Math.floor(window.REGVALUE/8) * Number(window.increaseSPEED);
          }
          
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // The mighty [[this.winningTile]] tile
          if (merged.value === this.winningTile) self.won = true;
        } else {
          if (!alreadyRAND && (Math.abs(tile.x-positions.farthest.x)+Math.abs(tile.y-positions.farthest.y))) {
            let n = document.querySelector('#pongNotif').style.display = Math.random() < (0.1 * game.upgrades.brickbreaker) ? 'block' : 'none';
  window.breaking = n === 'block'
            alreadyRAND = true;
          }
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function(direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0, y: -1 }, // Up
    1: { x: 1, y: 0 },  // Right
    2: { x: 0, y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function(vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function(cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
    this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function() {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function() {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell = { x: x + vector.x, y: y + vector.y };

          var other = self.grid.cellContent(cell);

          if (other && (other.value === tile.value || ([tile.value, other.value].includes('*')) || ([tile.value, other.value].includes('🍪')))) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function(first, second) {
  return first.x === second.x && first.y === second.y;
};
