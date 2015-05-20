var util = util || {};  //!< namespace util


//! A class for 2D vector.
util.Vector2D = function() {
  if (arguments.length == 0) {
    util.Vector2D.call(this, 0, 0);
  } else if (arguments.length == 1) {
    util.Vector2D.call(this, arguments[0].x, arguments[0].y);
  } else {
    this.x = arguments[0];
    this.y = arguments[1];
  }
};


util.Vector2D.prototype.clone = function() { return new util.Vector2D(this); };


util.Vector2D.prototype.copyFrom = function(t) {
  this.x = t.x;
  this.y = t.y;
  return this;
}


util.Vector2D.prototype.add = function(v2) {
  return (new util.Vector2D(this)).addToThis(v2);
};


util.Vector2D.prototype.addToThis = function(v2) {
  this.x += v2.x;
  this.y += v2.y;
  return this;
};


util.Vector2D.prototype.minus = function(v2) {
  return (new util.Vector2D(this)).minusToThis(v2);
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


util.Vector2D.prototype.normalize = function() {
  return this.div(this.length());
};


util.Vector2D.prototype.normalizeToThis = function() {
  return this.divToThis(this.length());
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


util.Vector2D.prototype.toRight = function() {
  return new util.Vector2D(-this.y, this.x);
};


util.Vector2D.prototype.toRightToThis = function() {
  return this.copyFrom(this.toRight());
};


util.Vector2D.prototype.rotate = function(ang) {
  var i = new util.Vector2D(Math.cos(-ang), Math.sin(-ang)), j = i.toRight();
  return new util.Vector2D(this.dot(i), this.dot(j));
};


util.Vector2D.prototype.rotateToThis = function(ang) {
  return this.copyFrom(this.rotate(ang));
};


util.Vector2D.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};


util.Enum = function() {
  for (var i = 0; i < arguments.length; ++i) {
    this[arguments[i]] = i;
  }
};


util.Pair = function(first, second) {
  this.first = first;
  this.second = second;
};


util.Reference = function(name, reference) {
  this.name = name;
  this.reference = reference;
};


util.Module = util.Reference;


util.dumpModules = function() {
  var refs = [];
  var dump = function(name, variable, init) {
    var type = (variable instanceof Array ? 'array' : (typeof variable));
    if (!util.dumpModules._handlers.hasOwnProperty(type)) {
      console.log('[ERROR] unsupport type ' + type + '(name = ' + name + ')');
      return '';
    }
    var ret = '';
    var p = util.dumpModules._handlers[type](name, variable, refs);
    ret += (init ? 'var ' : '') + name + ' = ' + p.first + ';\n\n';
    for (var i = 0; i < p.second.length; ++i) {
      ret += dump(p.second[i].name, p.second[i].reference, false);
    }
    return ret;
  }
  var ret = '';
  for (var i = 0; i < arguments.length; ++i) {
    ret += dump(arguments[i].name, arguments[i].reference, true);
  }
  return ret;
};


util.dumpModules._handlers = {};


util.dumpModules._handlers['number'] = function(name, value, refs) {
  return new util.Pair('' + value, []);
};


util.dumpModules._handlers['boolean'] = util.dumpModules._handlers['number'];


util.dumpModules._handlers['string'] = function(name, s, refs) {
  return new util.Pair("'" + util._escapeSpecialChar(s) + "'", []);
};


util.dumpModules._handlers['array'] = function(name, arr, refs) {
  var ref = util._updateReferences(name, arr, refs);
  if (ref !== false) {
    return new util.Pair(ref, []);
  }
  return new util.Pair(arr.length > 0 ? '[null] * ' + arr.length : '[]',
                       util._getObjectProperty(name, arr));
};


util.dumpModules._handlers['object'] = function(name, obj, refs) {
  if (obj === null) {
    return new util.Pair('null', []);
  }
  var ref = util._updateReferences(name, obj, refs);
  if (ref !== false) {
    return new util.Pair(ref, []);
  }
  return new util.Pair('{}', util._getObjectProperty(name, obj));
};


util.dumpModules._handlers['function'] = function(name, func, refs) {
  var ref = util._updateReferences(name, func, refs);
  if (ref !== false) {
    return new util.Pair(ref, []);
  }
  var more = [];
  more = more.concat(util._getObjectProperty(name, func));
  more = more.concat(util._getObjectProperty(name + '.prototype',
                                             func.prototype));
  return new util.Pair(func.toString(), more);
};


util._updateReferences = function(name, obj, refs) {
  for (var i = 0; i < refs.length; ++i) {
    if (refs[i].reference === obj) {
      return refs[i].name;
    }
  }
  refs.push(new util.Reference(name, obj));
  return false;
};


util._getObjectProperty = function(name, obj) {
  var ret = [];
  for (var key in obj) {
    if (typeof key == 'number') {
      ret.push(new util.Reference(name + '[' + key + ']', obj[key]));
    } else {
      ret.push(new util.Reference(
              name + "['" + util._escapeSpecialChar(key) + "']", obj[key]));
    }
  }
  return ret;
};


util._escapeSpecialChar = function(s) {
  var matchChrs = {'\'' : "\\'",
                   '\"' : '\\"',
                   '\n' : '\\n',
                   '\r' : '\\r',
                   '\t' : '\\t',
                   '\b' : '\\b',
                   '\f' : '\\f',
                   '\\' : '\\\\'};
  var ret = '';
  for (var i = 0; i < s.length; ++i) {
    ret += (s[i] in matchChrs ? matchChrs[s[i]] : s[i]);
  }
  return ret;
};
