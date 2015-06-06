var ai = ai || {};  //!< namespace ai


ai.EDeDanXiaoGuay = function() {
  this._targetPoint = new api.MarkPoint(new api.Position(),
                                        '#006600', api.MarkPoint.Type.TARGET);
  this._esiguay = new ai.ESiGuay();
};


ai.EDeDanXiaoGuay.prototype.init = function() {
  api.addMark(this._targetPoint);
};


ai.EDeDanXiaoGuay.prototype.cleanup = function() {
  api.removeMark(this._targetPoint);
};

ai.EDeDanXiaoGuay.prototype.run = function() {
  var agent = api.getSelf();
  var opponents = api.getOpponents();
  var foods = api.getFoods();
  var spikes = api.getSpikes();

  var esc = this.getEscapePosition(agent, opponents, spikes);
  var target;
  if (esc !== false) {
    target = esc;
    this._targetPoint.type = this._targetPoint.Type.X;
  } else {
    target = this._esiguay.getTargetPosition(agent, foods);
    this._targetPoint.type = this._targetPoint.Type.TARGET;
  }
  this._targetPoint.position.copyFrom(target);
  api.setTargetPosition(target);
};

ai.EDeDanXiaoGuay.prototype.getEscapePosition = function(agent, oppns, spikes) {
  var vsum = new math.Vector2D(0, 0), wsum = 0;
  var update = function(v, w) {
    vsum.addToThis(v.times(w));
    wsum += w;
    needToEscape = true;
  }
  var needToEscape = false;
  for (var i = 0; i < oppns.length; ++i) {
    for (var j = 0; j < oppns[i].circles.length; ++j) {
      var d = 0, bad = api.getDangerRadius(oppns[i].circles[j].radius);
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
             2 * (myRadius * 1.75 - delta.length() / (myRadius * 1.75)));
    }
  }
  if (needToEscape) {
    if (vsum.length() > 0.00001) {
      vsum.normalizeToThis().timesToThis(agent.circles[0].radius * 2);
    }
    return agent.circles[0].center.add(vsum);
  } else {
    return false;
  }
};

ai.EDeDanXiaoGuay.prototype.getEscapePosition2 = function(agent, oppns, spikes) {
  var vsum = new math.Vector2D(0, 0), wsum = 0;
  var update = function(v, w) {
    vsum.addToThis(v.times(w));
    wsum += w;
    needToEscape = true;
  }
  var needToEscape = false;
  for (var i = 0; i < oppns.length; ++i) {
    for (var j = 0; j < oppns[i].circles.length; ++j) {
      var d = 0, bad = api.getDangerRadius(oppns[i].circles[j].radius);
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

  var boundary = [];
  boundary.push(new math.Vector2D(0 + myRadius / 2, agent.circles[0].center.y))
  boundary.push(new math.Vector2D(11180 - myRadius / 2, agent.circles[0].center.y))
  boundary.push(new math.Vector2D(agent.circles[0].center.x, 0 + myRadius / 2))
  boundary.push(new math.Vector2D(agent.circles[0].center.y, 11180 - myRadius / 2))
  for (var i = 0; needToEscape === true && i < 4; i ++) {
    console.log(agent.circles[0].center.minus(boundary[i]).length())
    bad = api.getDangerRadius();
    delta = agent.circles[0].center.minus(boundary[i])
    if (delta.length() < 200) {
      update(delta.normalize(), 2 * (bad - delta.length() / bad))
    }
  }



  for (var i = 0; i < spikes.length; ++i) {
    var delta = agent.circles[0].center.minus(spikes[i].center);
    if (spikes[i].radius < myRadius && delta.length() < myRadius * 1.75) {
      update(delta.normalize(),
             2 * (myRadius * 1.75 - delta.length() / (myRadius * 1.75)));
    }
  }
  if (needToEscape) {
     if (vsum.length() > 0.00001) {
       vsum.normalizeToThis().timesToThis(agent.circles[0].radius * 4);
     }
    //! console.log(agent.circles[0].center.add(vsum).x)
    //! console.log(agent.circles[0].center.add(vsum).y)
    return agent.circles[0].center.add(vsum);
  } else {
    return false;
  }
};
