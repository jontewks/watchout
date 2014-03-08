/* global d3 */


// ===== BOARD INFORMATION =======================
var board = {
  width: 750,
  height: 500,
  enemies: 15,
  itemRadius: 12,
  gameSpeed: 1000,
  score: 0,
  highScore: 0,
  collisions: 0
};

board.object = d3.select('body').append('svg')
  .attr('width', board.width)
  .attr('height', board.height)
  .style('border', 'solid #4d4d4d 3px');

board.scoring = function() {
  setInterval(function() {
    board.score += 1;
    d3.selectAll('.current span').data([board.score]).text(function(d) { return d;});
  }, 50);
};

board.checkCollision = function(allEnemies) {
  // expecting a d3 collection of all the enemies
  var player = d3.selectAll('.player');
  var radiusSum = board.itemRadius * 2;
  var pX, pY, eX, eY, xDiff, yDiff, separation;

  player.each(function() {
    pX = this.cx.animVal.value;
    pY = this.cy.animVal.value;
  });

  allEnemies.each(function() {
    eX = this.cx.animVal.value;
    eY = this.cy.animVal.value;
    xDiff = eX-pX;
    yDiff = eY-pY;
    separation = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));

    if(separation < radiusSum) {
      board.collision();
    }
  });
};

board.collision = function() {
  if(board.score > board.highScore) {
    board.highScore = board.score;
    d3.selectAll('.high span').data([board.highScore]).text(function(d) { return d;});
  }
  board.score = 0;
  window.setTimeout( function() {
    d3.selectAll('.collisions span').data([board.collisions++]).text(function(d) { return d;});
  }, 200);
};





// ===== ENEMIES OBJECT AND INSTANTIATION TOOLS =======================
var enemies = {
  index: [],
  genX: function() {
    return Math.floor(Math.random() * ((board.width-board.itemRadius)-board.itemRadius) + board.itemRadius);
  },
  genY: function() {
    return Math.floor(Math.random() * ((board.height-board.itemRadius)-board.itemRadius) + board.itemRadius);
  }
};

enemies.moveEnemies = function() {
  setInterval(function() {
    var enemiesColl = d3.selectAll('.enemy');

    enemiesColl.transition()
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

Player.prototype.makePlayer = function() {
  var x = board.width/2;
  var y = board.height/2;
  new Player(x, y);
};


// ===== START 'EM UP =======================
makeEnemies(board.enemies);
Player.prototype.makePlayer();


// ===== DATA BINDING =======================
board.object.selectAll('.enemy')
  .data(enemies.index)
  .enter().append('circle')
  .attr('class', 'enemy')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', board.itemRadius);


board.object.selectAll('.player')
  .data(player.index)
  .enter().append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', board.itemRadius)
  .attr('fill', 'red');

board.object.on('mousemove', function() {
  var mouseCoords = d3.mouse(this);
  d3.selectAll('.player')
    .attr('cx', mouseCoords[0])
    .attr('cy', mouseCoords[1]);
});

window.setInterval(function() {
  board.checkCollision(d3.selectAll('.enemy'));
},10);

enemies.moveEnemies();
board.scoring();

board.checkCollision(d3.selectAll('.enemy'));


