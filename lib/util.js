var util = util || {};  //!< namespace util


//! A class for 2D vector.
util.Vector2D = function() {
  if (arguments.length == 0) {
    util.Vector2D(0, 0);
  } else if (arguments.length == 1) {
    this.x = arguments[0].x;
    this.y = arguments[0].y;
    //this = util.Vector2D(arguments[0].x, arguments[0].y);
  } else {
    this.x = arguments[0];
    this.y = arguments[1];
  }
};


util.Vector2D.prototype.add = function(v2) {
  return (new util.Vector2D(this)).addToThis(v2);
};


util.Vector2D.prototype.addToThis = function(v2) {
  this.x += v2.x;
  this.y += v2.y;
  return this;
};


util.Vector2D.prototype.minus = function(v2) {
  return new util.Vector2D(this).minusToThis(v2);
};


util.Vector2D.prototype.minusToThis = function(v2) {
  this.x -= v2.x;
  this.y -= v2.y;
  return this;
};


util.Vector2D.prototype.times = function(s) {
  return (new util.Vector2D(this)).timesToThis(s);
};


util.Vector2D.prototype.timesToThis = function(s) {
  this.x *= s;
  this.y *= s;
  return this;
};


util.Vector2D.prototype.div = function(s) {
  return (new util.Vector2D(this)).divToThis(s);
};


util.Vector2D.prototype.divToThis = function(s) {
  this.x /= s;
  this.y /= s;
  return this;
};


util.Vector2D.prototype.dot = function(v2) {
  return this.x * v2.x + this.y * v2.y;
};


util.Vector2D.prototype.cross = function(v2) {
  return this.x * v2.y - this.y * v2.x;
};


util.Vector2D.prototype.length2 = function() {
  return this.dot(this);
};


util.Vector2D.prototype.length = function() {
  return Math.sqrt(this.length2());
};


util.Vector2D.prototype.angle = function() {
  var ang = Math.atan2(this.y, this.x), c = Math.PI * 2.0;
  while (ang >= c) ang -= c;
  while (ang < 0) ang += c;
  return ang;
};

util.Vector2D.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};
