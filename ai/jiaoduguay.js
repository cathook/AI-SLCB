var ai = ai || {};  //!< namespace ai

ai.JiaoDuGuay = function() {
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

  this._origin = new math.Vector2D(agent.circles[0].center);
  this._setToOrigin(agent, foods, opponents, spikes);
  var target = this.getJiaoDu(agent, foods, opponents, spikes);
  api.setTargetPosition(target);
};

ai.JiaoDuGuay.prototype.getJiaoDu = function(agent, foods, oppns, spikes) {
  var maxAng = 0;
  var maxVal = Number.NEGATIVE_INFINITY;

  var me = agent.circles[0];
  for (var angle = 0; angle < Math.PI; angle += (Math.PI / 100)) {
    var negVal = 0;
    var posVal = 0;

    this._norm = new math.Vector2D(-Math.sin(angle), Math.cos(angle));
  
    //get food value
    var val = this._getFoodsVal(me, foods);
    posVal += val[0];
    negVal += val[1];
    
    val = this._getOppnsVal(me, oppns);
    posVal += val[0];
    negVal += val[1];

    val = this._getSpikesVal(me, spikes);
    posVal += val[0];
    negVal += val[1];

    if (negVal > maxVal) {
      maxVal = negVal;
      maxAng = angle + Math.PI;
    }
    if (posVal > maxVal) {
      maxVal = posVal;
      maxAng = angle;
    }
  }

  ret =  new math.Vector2D(Math.cos(maxAng), Math.sin(maxAng))
                 .timesToThis(me.radius * 3)
                 .addToThis(this._origin);
  ret.x = Math.max(0, ret.x);
  ret.y = Math.max(0, ret.y);
  return ret;
};

ai.JiaoDuGuay.prototype._setToOrigin = function(agent, foods, oppns, spikes) {
  for (var i = 0; i < agent.length; i++) {
    agent.circles[i].center.minusToThis(this._origin);
  }

  for (var  i = 0; i < foods.length; i++) {
    foods[i].center.minusToThis(this._origin);
  }

  for (var i = 0; i < oppns.length; i++)
    for (var j = 0; j < oppns[i].circles.length; j++) {
      oppns[i].circles[j].center.minusToThis(this._origin);
    }

  for (var i = 0; i < spikes.length; i++) {
    spikes[i].center.minusToThis(this._origin);
  }
} 

ai.JiaoDuGuay.prototype._getFoodsVal = function(agent, foods) {
  var posVal = 0;
  var negVal = 0;
  for (var i = 0; i < foods.length; i++) {
    if (! this._inLine(foods[i], agent.radius, i)) {
      continue;
    }
    var food = foods[i];
    if (this._isPositive(food.center)) {
      posVal += this._getFoodVal(food);
    } else {
      negVal += this._getFoodVal(food);
    }
  }
  return [posVal, negVal];
}; 

ai.JiaoDuGuay.prototype._getOppnsVal = function(agent, oppns) {
  var posVal = 0;
  var negVal = 0;
  for (var i = 0; i < oppns.length; i++) {
    for (var j = 0; j < oppns[i].circles.length; j++) {
      var oppn = oppns[i].circles[j];
      if (!this._inLine(oppn, agent.radius, 1.5)) {
        continue;
      }
      if (this._isPositive(oppn.center)) {
        posVal += this._getOppnVal(oppn);
        negVal -= this._getOppnVal(oppn);
      } else {
        negVal += this._getOppnVal(oppn);
        posVal -= this._getOppnVal(oppn);
      }
    }
  }
  return [posVal, negVal];
};

ai.JiaoDuGuay.prototype._getSpikesVal = function(agent, spikes) {
  var posVal = 0;
  var negVal = 0;
  for (var i = 0; i < spikes.length; i++) {
    var spike = spikes[i];
    if (spike.radius > agent.radius || !this._inLine(spike, agent.radius, 1)) {
      continue;
    }
    if (this._isPositive(spike.center)) {
      posVal += this._getSpikeVal(oppn);
    } else {
      negVal += this._getSpikeVal(oppn);
    }
  }
  return [posVal, negVal];
};

ai.JiaoDuGuay.prototype._getFoodVal = function(food) {
  return 100 * food.radius * food.radius * food.radius * food.radius
          / food.center.length2();
};

ai.JiaoDuGuay.prototype._getOppnVal = function(oppn) {
  return -10 * oppn.radius / Math.sqrt(oppn.center.length());
};

ai.JiaoDuGuay.prototype._getSpikeVal = function(spike) {
  return -spike.radius / spike.center.length();
};

ai.JiaoDuGuay.prototype._isPositive = function(center) {
  return this._norm.cross(center) <= 0;
};

ai.JiaoDuGuay.prototype._inLine = function(circle, dis, par) {
  var r1 = circle.center.add(new math.Vector2D(this._norm).times(circle.radius));
  var r2 = circle.center.add(new math.Vector2D(this._norm).times(-circle.radius));
  return (this._norm.dot(r1) + dis * par) * (this._norm.dot(r2) - dis * par) <= 0;
  
  //return this._getLineDistance(r1) <= dis || this._getLineDistance(r2) <= dis;
};

ai.JiaoDuGuay.prototype._getLineDistance = function(center) {
  return Math.abs(this._norm.dot(center)); // this._norm.length();
};
