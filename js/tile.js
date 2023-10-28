function Tile(position, value = 2, colour) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
  this.colour = colour || 0; // 0=none (default) 1=red 2=blue 3=green 4=yellow 5=black yaya uno colours in 2048 mod haha
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value,
    colour: this.colour
  };
};
