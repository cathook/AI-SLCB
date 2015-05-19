var ESIGUAY = ESIGUAY || {};


ESIGUAY.dis2 = function(a, b) {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
};


ESIGUAY.run = function() {
  var foods = api.getFoods();
  var self = api.getSelf();
  if (self.circles.length !== 0){
    var nearest = 0;
    var min = Infinity;
    var myPos = api.getSelf().circles[0].position;
    for (var i = 0 ; i < foods.length ; i++) {
      var dis = ESIGUAY.dis2(foods[i].position, myPos);
      if (dis < min) {
        min = dis;
        nearest = i;
      }
    }
    api.setTargetPosition(foods[i].position, true);
  }
  window.setTimeout(ai.run, 500);
};


ESIGUAY.init = function() {
  ESIGUAY.run();
};