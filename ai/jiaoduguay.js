var ai = ai || {};  //!< namespace ai

ai.JiaoDuGuay = function() {
  this.jiaoduguay = new ai.JiaoDuGuay();
};

ai.JiaoDuGuay.prototype.init = function() {

};

ai.JiaoDuGuay.prototype.cleanup = function() {

};

ai.JiaoDuGuay.prototype.run = function() {
  var agent = api.getSelf();
  var opponents = api.getOpponents();
  var foods = api.getFoods();
  var spikes = api.getSpikes();

  this._origin = new Vector2D(agnet.circles[0]
  ai.JiaoDuGuay._setToOrigin(agent, foods, oppns, spikes);
  var target = this.getJiaoDu(agent, foods, opponents, spikes);
  api.setTargetPosition(target.add(this._origin));
};

ai.JiaoDuGuay.prototype.getJiaoDu = function(agent, foods, oppns, spikes) {
  var maxAng = 0;
  var maxVal = Number.NEGATIVE_INFINITY;

  var me = agent.cirlces[0];
  for (var angle = 0; angle < Math.PI; angle += (Math.PI / 10)) {
    var negVal = 0;
    var posVal = 0;

    this._slope = new Vector2D(-Math.sin(angle), Math.cos(angle));
  
    //get food value
    [negTmp, posTmp] = ai.JiaoDuGuay._getFoodsVal(me, foods);
    negVal += negTmp;
    posVal += posTmp;
    
    if (negVal > maxVal) {
      maxVal = negVal;
      maxAng = angle;
    }
    if (posVal > maxVal) {
      maxVal = posVal;
      maxAng = angle;
    }

  }
};

ai.JiaoDuGuay.prototype._setToOrigin = function(agent, foods, oppns, spikes) {
  for (var i = 0; i < agent.length; i++) {
    agent.circles[i].center.minusToThis(this._origin);
  }

  for (var  i = 0; i < foods; i++) {
    foods.center.minusToThis(this._origin);
  }

  for (var i = 0; i < oppns; i++)
    for (var j = 0; j < oppns[i].circles.length; j++) {
      oppns[i].circles[j].center.minusToThis(this._origin);
    }

  for (var i = 0; i < spikes; i++) {
    spikes.center.minusToThis(this._origin);
  }
} 

ai.JiaoDuGuay.prototype._getFoodsVal = function(agent, foods) {
  var posVal = 0;
  var negVal = 0;
  for (var i = 0; i < foods.length; i++) {
    if (! this._inArea(foods[i], agent.radius)
      continue;
    var food = foods[i];
    if (this._isPositive(food)) {
      posVal += this._getFoodVal(food);
    } else {
      negVal += this._getFoodVal(food);
    }
  }
  return [posVal, negVal];
}; 

ai.JiaoDuGuay.prototype._getFoodVal = function(food) {
  return 100 * food.radius / this._origin.minus(food).length2();
};

ai.JiaoDuGuay.prototype._isPositive = function(center) {
  return this._slope.cross(center) <= 0;
};

ai.JiaoDuGuay.prototype._inArea = function(circle, dis) {
  var r1 = circle.center.add(new Vector2D(this._slope).times(circle.radius));
  var r2 = circle.center.add(new Vector2D(this._slope).times(-circle.radius));
  var edge = new Vector2D(this._slope.y, -this._slope.x);
  return Math.abs(this._getLineDistance(circle)) <= dis;
};

ai.JiaoDuGuay.prototype._getLineDistance = function(center) {
  return this._slope.dot(center) / this._slope.length();
};
