var ai = ai || {};  //!< namespace ai

ai.ededanxiaoguay = ai.ededanxiaoguay || {};  //! <namespace ai.ededanxiaoguay


//! Starts to use this agent.
ai.ededanxiaoguay.start = function() {
  ai.ededanxiaoguay._targetPoint = new api.MarkPoint(new api.Position(),
                                                     '#006600',
                                                     api.MarkPointType.TARGET);
  ai.ededanxiaoguay._runFlag = true;
  api.addMark(ai.ededanxiaoguay._targetPoint);
  ai.ededanxiaoguay._run();
};


//! Stops this agent.
ai.ededanxiaoguay.stop = function() {
  ai.ededanxiaoguay._runFlag = false;
  api.removeMark(ai.ededanxiaoguay._targetPoint);
};


ai.ededanxiaoguay.getEscapeTargetPosition = function(agent, oppns) {
  var vsum = new util.Vector2D(0, 0), wsum = 0;
  var needToEscape = false;
  for (var i = 0; i < oppns.length; ++i) {
    for (var j = 0; j < oppns[i].circles.length; ++j) {
      var d = 0, bad = api.estimateDangerRadius(oppns[i].circles[j].radius);
      d += oppns[i].circles[j].center.minus(agent.circles[0].center).length();
      d -= oppns[i].circles[j].radius;
      d += agent.circles[0].radius;
      if (d < bad) {
        var delta = agent.circles[0].center.minus(oppns[i].circles[j].center);
        var w = 2 * (bad - d);
        vsum.addToThis(delta.times(w / delta.length()));
        wsum += w / bad;
        needToEscape = true;
      }
    }
  }
  return (needToEscape ? agent.circles[0].center.add(vsum.div(wsum)) : false);
};


//! run...
ai.ededanxiaoguay._run = function() {
  var goNext = function() { window.setTimeout(ai.ededanxiaoguay._run, 500); };
  if (ai.ededanxiaoguay._runFlag !== true) {
    return;
  }

  var agent = api.getSelf();
  if (agent.circles.length == 0) {
    goNext();
    return;
  }

  var t = ai.ededanxiaoguay.getEscapeTargetPosition(agent, api.getOpponents());
  if (t === false) {
    t = ai.esiguay.getTargetPosition(agent, api.getFoods());
    ai.ededanxiaoguay._targetPoint.type = api.MarkPointType.TARGET;
  } else {
    ai.ededanxiaoguay._targetPoint.type = api.MarkPointType.X;
  }
  api.setTargetPosition(t);
  ai.ededanxiaoguay._targetPoint.position.copyFrom(t);

  goNext();
};


ai.ededanxiaoguay._targetPoint = null;
