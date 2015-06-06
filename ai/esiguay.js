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

ai.ESiGuay.prototype.getTargetPosition2 = function(agent, foods) {

 

  var getDistance = function(agent, vec, food) {
    var normedFoodCenter = food.center.minus(agent.circles[0].center);
    //! console.log(vec)
    //! console.log(normedFoodCenter)

    cosTheta = (vec.x * normedFoodCenter.x + vec.y * normedFoodCenter.y) / (vec.length() * normedFoodCenter.length());
    //! console.log(cosTheta);
    if (cosTheta < 0) {
      return Infinity;
    } else {
      //! console.log(normedFoodCenter.length() * (1 - Math.sqrt(1 - Math.pow(cosTheta, 2))));
      return normedFoodCenter.length() * Math.sqrt(1 - Math.pow(cosTheta, 2));
    }
  };
  var ret;
  var myRadius = agent.circles[0].radius;
  if (foods.length == 0) {
    ret = agent.circles[0].center.clone();
  } else {
    var foodCount = 0;
    var mostIndex = 0;
    for (var i = 0; i < foods.length; i ++) {
      //! var vec = agent.circles[0].center.minus(foods[i].center);
      var vec = foods[i].center.minus(agent.circles[0].center);
      var tmpFoodCount = 0;
      for (var j = 0; j < foods.length; j ++) {
        if (getDistance(agent, vec, foods[j]) < 0.9 * myRadius) {
          tmpFoodCount ++;
        }
      }
      if (tmpFoodCount > foodCount) {
        foodCount = tmpFoodCount;
        mostIndex = i;
      }
    }
    //! console.log("Total food")
    //! console.log(foodCount)
    ret = foods[mostIndex].center.clone();
  }
  return ret;
}
