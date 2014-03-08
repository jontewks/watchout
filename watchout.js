var board = {
  'width': 750,
  'height': 500,
  'enemies': 15,
  'enemyRadius': 12,
  'gameSpeed': 2000
};

board.object = d3.select('body').append('svg')
  .attr('width', board.width)
  .attr('height', board.height)
  .style('border', 'solid #4d4d4d 3px');

var enemies = {};
enemies.index = [];
enemies.genX = function() {
  return Math.floor(Math.random() * ((board.width-board.enemyRadius)-board.enemyRadius) + board.enemyRadius);
};
enemies.genY = function() {
  return Math.floor(Math.random() * ((board.height-board.enemyRadius)-board.enemyRadius) + board.enemyRadius);
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
    var id = i;
    new Enemy(x, y, id);
  }
};

makeEnemies(board.enemies);

enemies.instances = board.object.selectAll('.enemy');
enemies.instances.data(enemies.index)
  .enter().append('circle')
  .attr('class', 'enemy')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', board.enemyRadius);

window.setInterval(function() {
  d3.select('body').selectAll('.enemy').transition()
    .duration(board.gameSpeed)
    .attr('cx', enemies.genX)
    .attr('cy', enemies.genY);
}, board.gameSpeed+board.gameSpeed/2);
