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


ai.esiguay.getTargetPosition = function(agent, foods) {
  var ret;
  if (foods.length == 0) {
    ret = agent.circles[0].clone();
  } else {
    var nearest = 0, mindist = Number.POSITIVE_INFINITY;
    for (var i = 0; i < foods.length; ++i) {
      var dist = foods[i].center.minus(agent.circles[0].center).length2();
      if (dist < mindist) {
        mindist = dist;
        nearest = i;
      }
    }
    ret = foods[nearest].center.clone();
  };
  return ret;
};


//! run...
ai.esiguay._run = function() {
  var goNext = function() { window.setTimeout(ai.esiguay._run, 500); };
  if (ai.esiguay._runFlag !== true) {
    return;
  }

  var agent = api.getSelf();
  if (agent.circles.length == 0) {
    goNext();
    return;
  }

  var dst = ai.esiguay.getTargetPosition(agent, api.getFoods());
  api.setTargetPosition(dst);
  ai.esiguay._targetPoint.position.copyFrom(dst);

  goNext();
};


ai.esiguay._targetPoint = null;
