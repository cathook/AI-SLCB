var ai = ai || {};  //!< namespace ai

ai.ededanxiaoguay = ai.ededanxiaoguay || {};  //!< namespace ai.ededanxiaoguay


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


ai.ededanxiaoguay.getEscapeTargetPosition = function(agent, oppns, spikes) {
  var vsum = new util.Vector2D(0, 0), wsum = 0;
  var update = function(v, w) {
    vsum.addToThis(v.times(w));
    wsum += w;
    needToEscape = true;
  }
  var needToEscape = false;
  for (var i = 0; i < oppns.length; ++i) {
    for (var j = 0; j < oppns[i].circles.length; ++j) {
      var d = 0, bad = api.estimateDangerRadius(oppns[i].circles[j].radius);
      d += oppns[i].circles[j].center.minus(agent.circles[0].center).length();
      d -= oppns[i].circles[j].radius * 1.1;
      d += agent.circles[0].radius / 2;
      if (d < bad) {
        var delta = agent.circles[0].center.minus(oppns[i].circles[j].center);
        update(delta.normalize(), 2 * (bad - d) / bad);
      }
    }
  }
  var myRadius = agent.circles[0].radius;
  for (var i = 0; i < spikes.length; ++i) {
    var delta = agent.circles[0].center.minus(spikes[i].center);
    if (spikes[i].radius < myRadius && delta.length() < myRadius * 1.75) {
      update(delta.normalize(),
             3 * (myRadius * 1.75 - delta.length() / (myRadius * 1.75)));
    }
  }
  var len = api.estimateDangerRadius(agent.circles[0].radius);
  return (needToEscape ? agent.circles[0].center.add(vsum.times(len).div(wsum))
                       : false);
};


//! run...
ai.ededanxiaoguay._run = function() {
  var goNext = function() { window.setTimeout(ai.ededanxiaoguay._run, 100); };
  if (ai.ededanxiaoguay._runFlag !== true) {
    return;
  }

  var agent = api.getSelf();
  if (agent.circles.length == 0) {
    goNext();
    return;
  }

  var t = ai.ededanxiaoguay.getEscapeTargetPosition(
      agent, api.getOpponents(), api.getSpikes());
  if (t === false) {
    t = ai.esiguay2.getTargetPosition(agent, api.getFoods());
    ai.ededanxiaoguay._targetPoint.type = api.MarkPointType.TARGET;
  } else {
    ai.ededanxiaoguay._targetPoint.type = api.MarkPointType.X;
  }
  api.setTargetPosition(t);
  ai.ededanxiaoguay._targetPoint.position.copyFrom(t);

  goNext();
};


ai.ededanxiaoguay._targetPoint = null;
