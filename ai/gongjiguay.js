var ai = ai || {}; //!< namespace ai


ai.GongJiGuay = function() {
  this._targetPoint = new api.MarkPoint(new api.Position(),
                                        '#006600', api.MarkPoint.Type.TARGET);
  this._esiguay = new ai.ESiGuay();
  this._ededanxiaoguay = new ai.EDeDanXiaoGuay();
  this._lastsplittime = 0;
};


ai.GongJiGuay.prototype.init = function() {
  api.addMark(this._targetPoint);
};

ai.GongJiGuay.prototype.cleanup = function() {
  api.removeMark(this._targetPoint);
};


ai.GongJiGuay.prototype.run = function() {
  var agent = api.getSelf();
  var opponents = api.getOpponents();
  var foods = api.getFoods();
  var spikes = api.getSpikes();

  var esc = this._ededanxiaoguay.getEscapePosition2(agent, opponents, spikes);
  var target;
  var atk = false;
  var atk_flag = 0;

  //! api.split();

  if (esc !== false) {
    target = esc;
    this._targetPoint.type = this._targetPoint.Type.X;
  } else {
    if ((+new Date) - (this._lastsplittime) > 1000) {
      atk = this.getAttackTargetPosition(agent, foods);  
    }
    
    if (atk === false) {
      //! Now using getTargetPosition2
      target = this._esiguay.getTargetPosition2(agent, foods);
      this._targetPoint.type = this._targetPoint.Type.TARGET;  
    } else {
      atk_flag = 1;
      target = atk;
      this._targetPoint.type = this._targetPoint.Type.TARGET;
    }
    
  }
  this._targetPoint.position.copyFrom(target);
  api.setTargetPosition(target);
  if (atk_flag == 1) {
    this._lastsplittime = +new Date;
    api.split();
  }
};

// need some arguments?
ai.GongJiGuay.prototype.getAttackTargetPosition = function(agent, foods) {
  ret = false;
  if (agent.circles.length == 1) {
    for (var i = 0; i < foods.length; i ++) {
      if (foods[i].radius > 20 && foods[i].radius * 1.7 < agent.circles[0].radius) {
        dist = foods[i].center.minus(agent.circles[0].center).length();
        console.log(dist);
        if (dist < 600) {
          ret = foods[i].center.clone();  
          break;
        }
      }
    }  
  }
  else {
    console.log("Too much");
  }
  
  return ret;
};
