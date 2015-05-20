var ai = ai || {};  //!< namespace ai

ai.esiguay2 = ai.esiguay2 || {};  //!< namespace ai.esiguay2


//! Starts to use this agent.
ai.esiguay2.start = function() {
  ai.esiguay2._targetPoint = new api.MarkPoint(new api.Position(),
                                              '#006600',
                                              api.MarkPointType.TARGET);
  ai.esiguay2._runFlag = true;
  api.addMark(ai.esiguay2._targetPoint);
  ai.esiguay2._run();
};


//! Stops this agent.
ai.esiguay2.stop = function() {
  ai.esiguay2._runFlag = false;
  api.removeMark(ai.esiguay2._targetPoint);
}


ai.esiguay2.getTargetPosition = function(agent, foods) {
  var ret;
  if (foods.length == 0) {
    ret = agent.circles[0].center.clone();
  } else {
    var nearest = 0, minval = Number.POSITIVE_INFINITY;
    for (var i = 0; i < foods.length; ++i) {
      var r2 = api.getMapRect().minus(foods[i].center);
      var val = 0;
      val += foods[i].center.minus(agent.circles[0].center).length2() * 100;
      val += Math.pow(Math.max(foods[i].center.x, r2.x), 3);
      val += Math.pow(Math.max(foods[i].center.y, r2.y), 3);
      if (val < minval) {
        minval = val;
        nearest = i;
      }
    }
    ret = foods[nearest].center.clone();
  };
  return ret;
};


//! run...
ai.esiguay2._run = function() {
  var goNext = function() { window.setTimeout(ai.esiguay2._run, 500); };
  if (ai.esiguay2._runFlag !== true) {
    return;
  }

  var agent = api.getSelf();
  if (agent.circles.length == 0) {
    goNext();
    return;
  }

  var dst = ai.esiguay2.getTargetPosition(agent, api.getFoods());
  api.setTargetPosition(dst);
  ai.esiguay2._targetPoint.position.copyFrom(dst);

  goNext();
};


ai.esiguay2._targetPoint = null;
