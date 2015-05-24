var ai = ai || {};  //!< namespace ai


ai.ESiGuay = function() {
  this._targetPoint = new api.MarkPoint(new api.Position(),
                                        '#006600', api.MarkPoint.Type.TARGET);
}

ai.ESiGuay.prototype.init = function() {
  api.addMark(this._targetPoint);
};


ai.ESiGuay.prototype.cleanup = function() {
  api.removeMark(this._targetPoint);
};

ai.ESiGuay.prototype.run = function() {
  var agent = api.getSelf();
  var foods = api.getFoods();

  var target = this.getTargetPosition(agent, foods);
  this._targetPoint.position.copyFrom(target);
  api.setTargetPosition(target);
};

ai.ESiGuay.prototype.getTargetPosition = function(agent, foods) {
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
