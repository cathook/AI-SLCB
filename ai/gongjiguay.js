var ai = ai || {}; //!< namespace ai


ai.GongJiGuay = function() {
  this._targetPoint = new api.MarkPoint(new api.Position(),
                                        '#006600', api.MarkPoint.Type.TARGET);
};


ai.GongJiGuay.prototype.init = function() {
  api.addMark(this._targetPoint);
};

ai.GongJiGuay.prototype.cleanup = function() {
  api.removeMark(this._targetPoint);
};


ai.GongJiGuay.prototype.run = function() {};

// need some arguments?
ai.GongJiGuay.getAttackTargetPosition = function() {};
