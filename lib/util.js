var util = util || {};  //!< @namespace util


/*!
 * @function Initializes this module.
 */
util.init = function() {
  /*!
   * @class Enumerate.
   *
   * usage:
   * @code{javascript}
   *   e1 = new util.Enum('AA', 'BB', 'CC');
   *   console.log('AA' in e1);  // true
   *   console.log('BB' in e1);  // true
   *   console.log(e1.AA == e1.BB);  // false
   * @endcode
   */
  util.Enum = function() {
    for (var i = 0; i < arguments.length; ++i) {
      this[arguments[i]] = i;
    }
  };


  /*!
   * @struct A pair of objects.
   *
   * @var first The first element.
   * @var second The second element.
   */
  util.Pair = function() {
    if (arguments.length == 0) {
      util.Pair.call(this, null, null);
    } else if (arguments.length == 1) {
      util.Pair.call(this, arguments[0].first, arguments[1].second);
    } else {
      this.first = arguments[0];
      this.second = arguments[1];
    }
  };


  /*!
   * @class A set.
   */
  util.Set = function() {
    this._elements = [];
  };

  /*!
   * @function Adds an element to the set if it is not exist.
   *
   * @param [in] e The refernece to that element.
   */
  util.Set.prototype.add = function(e) {
    if (this._elements.indexOf(e) < 0) {
      this._elements.push(e);
    }
  };

  /*!
   * @function Removes an element from the set if exists.
   *
   * @param [in] e The refernece to that element.
   */
  util.Set.prototype.remove = function(e) {
    var index = this._elements.indexOf(e);
    if (index >= 0) {
      this._elements.splice(index, 1);
    }
  };

  /*!
   * @function For each element, calls the gived function...
   *
   * @param [in] The function.
   */
  util.Set.prototype.forEach = function(func) {
    for (var i = 0; i < this._elements.length; ++i) {
      func(this._elements[i]);
    }
  };


  /*!
   * @class An exception about no implementation.
   *
   * @var message The error message.
   */
  util.NoImplementation = function() {
    this.message = 'no implementation here';
  };


  /*!
   * @class An exception about "this function has not been initialized yet".
   *
   * @var message The error message.
   */
  util.Uninitialized = function() {
    this.message = 'it has not been initialized yet.';
  };


  /*!
   * @function Escapes special characters in a gived string.
   *
   * @param [in] s The string to be parsed.
   *
   * @return The reslut string.
   */
  util.escapeSpecialChar = function(s) {
    var matchChrs = {
      '\'' : "\\'",
      '\"' : '\\"',
      '\n' : '\\n',
      '\r' : '\\r',
      '\t' : '\\t',
      '\b' : '\\b',
      '\f' : '\\f',
      '\\' : '\\\\'
    };
    var ret = '';
    for (var i = 0; i < s.length; ++i) {
      ret += (s[i] in matchChrs ? matchChrs[s[i]] : s[i]);
    }
    return ret;
  };


  /*!
   * @function Lets the first class inherits from the second class.
   *
   * @param [in] childClass The first class.
   * @param [in] parentClass The second class.
   */
  util.setInheritFrom = function(childClass, parentClass) {
    var TmpClass = function() {};
    TmpClass.prototype = parentClass.prototype;
    childClass.prototype = new TmpClass();
    childClass.prototype.constructor = childClass;
  };


  util.transformArray = function(arr, func) {
    var ret = [];
    for (var i = 0; i < arr.length; ++i) {
      ret.push(func(arr[i]));
    }
    return ret;
  };
};
