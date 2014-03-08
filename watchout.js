/* global d3 */


// ===== BOARD INFORMATION =======================
var board = {
  width: 750,
  height: 500,
  enemies: 15,
  enemyRadius: 12,
  gameSpeed: 1000
};

board.object = d3.select('body').append('svg')
  .attr('width', board.width)
  .attr('height', board.height)
  .style('border', 'solid #4d4d4d 3px');



// ===== ENEMIES OBJECT AND INSTANTIATION TOOLS =======================
var enemies = {
  index: [],
  genX: function() {
    return Math.floor(Math.random() * ((board.width-board.enemyRadius)-board.enemyRadius) + board.enemyRadius);
  },
  genY: function() {
    return Math.floor(Math.random() * ((board.height-board.enemyRadius)-board.enemyRadius) + board.enemyRadius);
  }
};

enemies.moveEnemies = function() {
  setInterval(function() {
    d3.select('body').selectAll('.enemy')
      .transition()
      .duration(board.gameSpeed)
      .attr('cx', enemies.genX)
      .attr('cy', enemies.genY);
  }, board.gameSpeed);
};

var Enemy = function(x, y) {
  this.x = x;
  this.y = y;
  enemies.index.push(this);
};

var makeEnemies = function(num) {
  for (var i = 0; i < num; i++) {
    var x = enemies.genX();
    var y = enemies.genY();
    new Enemy(x, y);
  }
};


// ===== PLAYER OBJECT AND INSTANTIATION TOOLS =======================
var player = {
  index: []
};

var Player = function(x, y) {
  this.x = x;
  this.y = y;
  player.index.push(this);
};

var makePlayer = function() {
  var x = board.width/2;
  var y = board.height/2;
  new Player(x, y);
};


// ===== START 'EM UP =======================
makeEnemies(board.enemies);
makePlayer();


// ===== DATA BINDING =======================
board.object.selectAll('.enemy')
  .data(enemies.index)
  .enter().append('circle')
  .attr('class', 'enemy')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', board.enemyRadius);


board.object.selectAll('.player')
  .data(player.index)
  .enter().append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', board.enemyRadius)
  .attr('fill', 'red');

board.object.on('mousemove', function() {
  var mouseCoords = d3.mouse(this);
  console.log(mouseCoords);
  d3.selectAll('.player')
    .attr('cx', mouseCoords[0])
    .attr('cy', mouseCoords[1]);
});

enemies.moveEnemies();


