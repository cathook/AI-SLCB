var ai = ai || {};  //!< @namespace ai

ai.ti_du_guay = {};  //!< @namespace ai.ti_du_guay


ai.ti_du_guay.init = function(util, math, mark, api) {
  var _ = ai.ti_du_guay;


  _.CenterFunc = function() {
    this._center = api.getWorldSize().div(2);

    this._maxValue = null;
    this._pow = null;

    this.setValue(this.MAX_VALUE, this.POW);
  };

  _.CenterFunc.prototype.MAX_VALUE = 10;

  _.CenterFunc.prototype.POW = 3;

  _.CenterFunc.prototype.setValue = function(maxValue, pow) {
    this._maxValue = maxValue;
    this._pow = pow;
  };

  _.CenterFunc.prototype.getValue = function(pos) {
    var rat = pos.minus(this._center).length() / this._center.length();
    return Math.pow(rat, this._pow) * this._maxValue;
  };

  _.CenterFunc.prototype.getGrad = function(pos) {
    var delta = pos.minus(this._center);
    var a = this._maxValue / Math.pow(this._center.length(), this._pow);
    var x = math.getDistanceGrad(delta);
    return math.getDistanceGrad(delta).times(
        a * this._pow * Math.pow(delta.length(), this._pow - 1));
  };


  _.SegsLinearFunc = function(center) {
    this._center = center;
    this._func = null;
  };

  _.SegsLinearFunc.prototype.setFunc = function(ps) {
    this._func = new math.SegsLinearFunc(ps);
  };

  _.SegsLinearFunc.prototype.getValue = function(pos) {
    return this._func.getY(pos.minus(this._center).length());
  };

  _.SegsLinearFunc.prototype.getGrad = function(pos) {
    var delta = pos.minus(this._center);
    return math.getDistanceGrad(delta).times(
        this._func.getDerivY(delta.length()));
  };


  _.SmallDangerFunc = function(danger, me) {
    ai.ti_du_guay.SegsLinearFunc.call(this, danger.center);

    this._radius = danger.radius;
    this._radius0 = me.radius;

    this.setParam(this.DEFAULT_RATIO, this.MAX_VALUE);
  };

  util.setInheritFrom(_.SmallDangerFunc, _.SegsLinearFunc);

  _.SmallDangerFunc.prototype.DEFAULT_RATIO = 4;

  _.SmallDangerFunc.prototype.MAX_VALUE = 5;

  _.SmallDangerFunc.prototype.setParam = function(ratio, maxValue) {
    var y0 = (this._radius - this._radius0) / ratio * maxValue;
    var x1 = this._radius * ratio;
    this.setFunc([new math.Vector2D(0, y0),
                  new math.Vector2D(x1, 0),
                  new math.Vector2D(x1 + 1, 0)]);
  };


  _.LargeDangerFunc = function(danger, me) {
    ai.ti_du_guay.SegsLinearFunc.call(this, danger.center);

    this._radius = danger.radius;
    this._radius0 = me.radius;

    this.setParam(
        this.RATIO, this.HALF_DIST_RATIO, this.MAX_VALUE, this.VK, this.DK);
  };

  util.setInheritFrom(_.LargeDangerFunc, _.SegsLinearFunc);

  _.LargeDangerFunc.prototype.RATIO = 1.7;

  _.LargeDangerFunc.prototype.HALF_DIST_RATIO = 3;

  _.LargeDangerFunc.prototype.MAX_VALUE = 50;

  _.LargeDangerFunc.prototype.VK = 0.5;

  _.LargeDangerFunc.prototype.DK = 2;

  _.LargeDangerFunc.prototype.setParam = function(r, h, m, vk, dk) {
    var halfDist = this._radius * h;
    var delta = Math.abs(this._radius - r * this._radius0);
    var maxValue = m * Math.exp(-delta / halfDist * math.LOG2);

    this.setFunc([new math.Vector2D(this._radius, maxValue),
                  new math.Vector2D(api.getDangerRadius(), maxValue * vk),
                  new math.Vector2D(api.getDangerRadius() * dk, 0),
                  new math.Vector2D(api.getDangerRadius() * dk + 1, 0)]);
  };


  _.FoodFunc = function(danger, me) {
    _.SegsLinearFunc.call(this, danger.center);

    this._radius0 = api.getDangerRadius();

    this.setParam(this.MAX_VALUE, this.R, this.RANGE_K, this.RANGE_K2);
  };

  util.setInheritFrom(_.FoodFunc, _.SegsLinearFunc);

  _.FoodFunc.prototype.MAX_VALUE = 2;

  _.FoodFunc.prototype.R = 0.3;

  _.FoodFunc.prototype.RANGE_K = 0.6;

  _.FoodFunc.prototype.RANGE_K2 = 9.3;

  _.FoodFunc.prototype.setParam = function(maxValue, r, rangeK, rangeK2) {
    this.setFunc([new math.Vector2D(0, -maxValue),
                  new math.Vector2D(this._radius0 * rangeK, -maxValue * r),
                  new math.Vector2D(this._radius0 * rangeK2, 0),
                  new math.Vector2D(this._radius0 * rangeK2 + 1, 0)]);
  };


  _.SpikeFunc = function(danger, me) {
    _.SegsLinearFunc.call(this, danger.center);

    this._radius = danger.radius;
    this._isDanger = (me.radius > danger.radius);

    this.setParam(this.MAX_VALUE, this.RADIUS_RATIO);
  };

  util.setInheritFrom(_.SpikeFunc, _.SegsLinearFunc);

  _.SpikeFunc.prototype.MAX_VALUE = 2;

  _.SpikeFunc.prototype.RADIUS_RATIO = 1;

  _.SpikeFunc.prototype.setParam = function(mv, rr) {
    if (this._isDanger) {
      this.setFunc([new math.Vector2D(this._radius, mv),
                    new math.Vector2D(api.getDangerRadius() * rr, 0)]);
    } else {
      this.setFunc([new math.Vector2D(0, 0), new math.Vector2D(1, 0)]);
    }
  };
};


ai.TiDuGuay = function() {
  this._funcs = [];
  this._mesh = new api.MarkMesh(new math.Vector2D(),
                                new math.Vector2D(),
                                50, 25,
                                this._getMeshColor.bind(this),
                                this._initMeshForDrawing.bind(this));
  this._meshValues = [];
};

ai.TiDuGuay.prototype.init = function() {
  api.addBackgroundMark(this._mesh);
};

ai.TiDuGuay.prototype.cleanup = function() {
  api.removeBackgroundMark(this._mesh);
};

ai.TiDuGuay.prototype.run = function() {
  var me = this._getLargestSelf();
  if (me == null) {
    return;
  }


  this.setFunc(me);
  var dir = new math.Vector2D(0, 0);
  for (var i = 0; i < this._funcs.length; ++i) {
    dir.addToThis(this._funcs[i].getGrad(me.center).times(-1));
  }

  api.setTargetPosition(me.center.add(dir.normalize().times(me.radius * 10)));
};

ai.TiDuGuay.prototype.setFunc = function(me) {
  this._funcs = [];

  this._funcs.push(new ai.ti_du_guay.CenterFunc());

  this._funcs = this._funcs.concat(
      util.transformArray(api.getFoods(), function(f) {
        return new ai.ti_du_guay.FoodFunc(f, me);
      }));
  this._funcs = this._funcs.concat(
      util.transformArray(api.getSpikes(), function(f) {
        return new ai.ti_du_guay.SpikeFunc(f, me);
      }));
  for (var i = 0, opp = api.getOpponents(); i < opp.length; ++i) {
    this._funcs = this._funcs.concat(
        util.transformArray(opp[i].circles, function(c) {
          if (c.radius > 1.6 * me.radius || true) {
            return new ai.ti_du_guay.LargeDangerFunc(c, me);
          } else {
            return new ai.ti_du_guay.SmallDangerFunc(c, me);
          }
        }));
  }
};

ai.TiDuGuay.prototype._getLargestSelf = function() {
  var ret = null, cand = api.getSelf().circles;
  for (var i = 0; i < cand.length; ++i) {
    if (ret == null || ret.radius < cand[i]) {
      ret = cand[i];
    }
  }
  return ret;
};

ai.TiDuGuay.prototype._initMeshForDrawing = function() {
  this._initMeshSize();
  this._initMeshValue();
};

ai.TiDuGuay.prototype._getMeshColor = function(place) {
  var p = this._getPercent(place);
  var red = Math.min(255, Math.max(0, Math.floor(256 * p)));
  var green = Math.min(255, Math.max(0, Math.floor(256 * (1 - p))));
  var blue = 0;
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
};

ai.TiDuGuay.prototype._initMeshSize = function() {
  var adj = function(k, mx, m, f) {
    return f(Math.max(0, Math.min(mx, k)) / m) * m;
  };
  var ltCorner = api.toWorldCoord(new math.Vector2D(0, 0));
  var rbCorner = api.toWorldCoord(api.getWindowSize());
  var size = api.getWorldSize();
  this._mesh.ltCorner.x = adj(ltCorner.x, size.x, 100, Math.floor);
  this._mesh.ltCorner.y = adj(ltCorner.y, size.y, 100, Math.floor);
  this._mesh.rbCorner.x = adj(rbCorner.x, size.x, 100, Math.ceil);
  this._mesh.rbCorner.y = adj(rbCorner.y, size.y, 100, Math.ceil);
};

ai.TiDuGuay.prototype._initMeshValue = function() {
  var minValue = Number.POSITIVE_INFINITY, maxValue = Number.NEGATIVE_INFINITY;
  var v = new math.Vector2D(), m = this._mesh;
  var ps = [];
  for (v.x = m.ltCorner.x; v.x <= m.rbCorner.x; v.x += m.distance) {
    ps.push(new util.Pair(v.x, []));
    for (v.y = m.ltCorner.y; v.y <= m.rbCorner.y; v.y += m.distance) {
      var value = 0;
      for (var i = 0; i < this._funcs.length; ++i) {
        value += this._funcs[i].getValue(v);
      }
      ps[ps.length - 1].second.push(new math.Vector2D(v.y, value));
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    }
  }
  var delta = maxValue - minValue < 1e-7 ? 100 : maxValue - minValue;
  for (var i = 0; i < ps.length; ++i) {
    for (var j = 0; j < ps[i].second.length; ++j) {
      ps[i].second[j].y = (ps[i].second[j].y - minValue) / delta;
    }
  }
  this._meshValues = util.transformArray(ps, function(l) {
    return new util.Pair(l.first, new math.SegsLinearFunc(l.second));
  });
};

ai.TiDuGuay.prototype._getPercent = function(place) {
  if (i == this._meshValues.length) {
    return 0;
  }
  for (var i = 0; i < this._meshValues.length - 1; ++i) {
    if (place.x <= this._meshValues[i].first) {
      break;
    }
  }
  var v2 = this._meshValues[i].second.getY(place.y);
  if (i == 0) {
    return v2;
  } else {
    var v1 = this._meshValues[i - 1].second.getY(place.y);
    var d = this._meshValues[i].first - this._meshValues[i - 1].first;
    return (v1 * (this._meshValues[i].first - place.x) / d +
            v2 * (place.x - this._meshValues[i - 1].first) / d);
  }
};
