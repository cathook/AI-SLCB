var ESIGUAY = ESIGUAY || {};


ESIGUAY.dis2 = function(a, b) {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
};


ESIGUAY.run = function() {
  console.log('0000000000000000');
  var goNext = function() { window.setTimeout(ESIGUAY.run, 500); };
  if (!api.isInitialized()) {
    goNext();
    console.log('fuck');
  }

  var self = api.getSelf();
  if (self.circles.length == 0) {
    goNext();
    console.log('fuc2k');
  }

  var foods = api.getFoods();
  if (foods.length == 0) {
    api.setTargetPosition(new api.Position(0, 0));
    console.log('fuck3');
  } else {
    var nearest = 0, min = Infinity;
    for (var i = 0; i < foods.length; ++i) {
      var dis = ESIGUAY.dis2(foods[i].center, self.circles[0].center);
      if (dis < min) {
        min = dis;
        nearest = i;
      }
    }
    api.setTargetPosition(foods[nearest].center);
    console.log('target: (' + foods[nearest].center.x + ', ' + foods[nearest].center.y + ')');
  }

  goNext();
};


ESIGUAY.init = function() {
  ESIGUAY.run();
};
