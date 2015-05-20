var ai = ai || {};  //!< namespace ai

ai.esiguay = ai.esiguay || {};  //!< namespace ai.esiguay


//! Starts to use this agent.
ai.esiguay.start = function() {
  ai.esiguay._targetPoint = new api.MarkPoint(new api.Position(),
                                              '#006600',
                                              api.MarkPointType.TARGET);
  ai.esiguay._runFlag = true;
  api.addMark(ai.esiguay._targetPoint);
  ai.esiguay._run();
};


//! Stops this agent.
ai.esiguay.stop = function() {
  ai.esiguay._runFlag = false;
  api.removeMark(ai.esiguay._targetPoint);
}


//! run...
ai.esiguay._run = function() {
  var goNext = function() { window.setTimeout(ai.esiguay._run, 500); };
  if (ai.esiguay._runFlag !== true) {
    return;
  }

  var self = api.getSelf();
  if (self.circles.length == 0) {
    goNext();
    return;
  }

  var foods = api.getFoods();
  if (foods.length == 0) {
    api.setTargetPosition(new api.Position(0, 0));
    console.log('warning!! no food');
  } else {
    var nearest = 0, mindist = Number.POSITIVE_INFINITY;
    for (var i = 0; i < foods.length; ++i) {
      var dist = foods[i].center.minus(self.circles[0].center).length2();
      if (dist < mindist) {
        mindist = dist;
        nearest = i;
      }
    }
    api.setTargetPosition(foods[nearest].center);
    ai.esiguay._targetPoint.position.copyFrom(foods[nearest].center);
  }

  goNext();
};

ai.esiguay._targetPoint = null;
