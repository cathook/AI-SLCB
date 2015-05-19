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
    var myPos = api.getSelf().circles[0].center;
    console.log(myPos.x + ', ' + myPos.y);

    if (foods.length > 0) {
      for (var i = 0 ; i < foods.length ; i++) {
        var dis = ESIGUAY.dis2(foods[i].center, myPos);
        if (dis < min && dis > 0) {
          min = dis;
          nearest = i;
        }
      }
      console.log('ININ ' + foods[nearest].center.x + ',' + foods[nearest].center.y);    
      api.setTargetPosition(foods[nearest].center);
    } else {
      api.setTargetPosition(new api.Position(0, 0));
    }
  }
  window.setTimeout(ESIGUAY.run, 500);
};


ESIGUAY.init = function() {
  ESIGUAY.run();
};