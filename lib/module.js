var module = module || {};  //!< @namespace module.


/*!
 * @function Initializes this module.
 *
 * @param [in] util The dependency module `util`.
 */
module.init = function(util) {
  /*!
   * @struct A reference to an object.
   *
   * @var name The name of this reference.
   * @var reference The reference to that object.
   */
  module.Reference = function(name, reference) {
    this.name = name;
    this.reference = reference;
  };


  /*!
   * @struct An module, which is just an alias of module.Reference.
   */
  module.Module = module.Reference;


  /*!
   * @struct Dumps a list of modules.
   *
   * @return A string contains all the gived modules.
   */
  module.dumpModules = function() {
    var refs = [];
    var dump = function(name, variable, init) {
      var type = (variable instanceof Array ? 'array' : (typeof variable));
      if (!module._handlers.hasOwnProperty(type)) {
        throw new TypeError('unsupport type ' + type + '(name = ' + name + ')');
      }
      var ret = '';
      var p = module._handlers[type](name, variable, refs);
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


  /*!
   * @var A dict of dumping module handler for different type of values.
   */
  module._handlers = {};


  /*!
   * @function Handles the number type.
   */
  module._handlers['number'] = function(name, value, refs) {
    return new util.Pair('' + value, []);
  };


  /*!
   * @function Handles the boolean type.
   */
  module._handlers['boolean'] = module._handlers['number'];


  /*!
   * @function Handles the string type.
   */
  module._handlers['string'] = function(name, s, refs) {
    return new util.Pair("'" + util.escapeSpecialChar(s) + "'", []);
  };


  /*!
   * @function Handles the array type.
   */
  module._handlers['array'] = function(name, arr, refs) {
    var ref = module._updateReferences(name, arr, refs);
    if (ref !== false) {
      return new util.Pair(ref, []);
    }
    if (arr.length == 0) {
      return new util.Pair('[]', []);
    } else {
      return new util.Pair('[null] * ' + arr.length,
                           module._getObjectProperty(name, arr));
    }
  };


  /*!
   * @function Handles the object type.
   */
  module._handlers['object'] = function(name, obj, refs) {
    if (obj === null) {
      return new util.Pair('null', []);
    }
    var ref = module._updateReferences(name, obj, refs);
    if (ref !== false) {
      return new util.Pair(ref, []);
    }
    return new util.Pair('{}', module._getObjectProperty(name, obj));
  };


  /*!
   * @function Handles the function type.
   */
  module._handlers['function'] = function(name, func, refs) {
    var ref = module._updateReferences(name, func, refs);
    if (ref !== false) {
      return new util.Pair(ref, []);
    }
    var properties = [];
    properties = properties.concat(module._getObjectProperty(name, func));
    properties = properties.concat(module._getObjectProperty(name + '.prototype',
                                                             func.prototype));
    return new util.Pair(func.toString(), properties);
  };


  /*!
   * @function Finds whether the gived object already exists or not and updates.
   *
   * @return False if it exists; otherwise return the name of that reference.
   */
  module._updateReferences = function(name, obj, refs) {
    for (var i = 0; i < refs.length; ++i) {
      if (refs[i].reference === obj) {
        return refs[i].name;
      }
    }
    refs.push(new module.Reference(name, obj));
    return false;
  };


  /*!
   * @function Lists all the property of an object.
   *
   * @return ...
   */
  module._getObjectProperty = function(name, obj) {
    var ret = [];
    for (var key in obj) {
      if (typeof key == 'number') {
        ret.push(new module.Reference(name + '[' + key + ']', obj[key]));
      } else {
        ret.push(new module.Reference(
            name + "['" + util.escapeSpecialChar(key) + "']", obj[key]));
      }
    }
    return ret;
  };
};
