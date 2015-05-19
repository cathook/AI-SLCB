var content = content || {};  //!< namespace content


//! @brief Event handler for window's onload event.
content.initFunc = function() {
  api.init();
  ai.esiguay.start();

  api.setSelfName('default name');
};


//! @brief Extension's entry point.
content.main = function() {
  var code = '';
  code += content._dumpModule('util', util);
  code += content._dumpModule('api', api);
  code += content._dumpModule('ai', ai);
  code += 'window.onload = ' + content.initFunc.toString() + ';\n';

  content._insertJS(code);
};


//! @brief Inserts a peace of javascript code tag.
//! @param [in] code The code.
content._insertJS = function(code) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.innerHTML = code;

  var htmls = document.getElementsByTagName('html');
  htmls[htmls.length - 1].appendChild(script);
};


//! @brief Dumps all the functions in the gived module.
//! @param [in] name Name of the module.
//! @param [in] module The module object.
content._dumpModule = function(name, module, noNeedInit) {
  var ret = '';
  if (noNeedInit !== true) {
    ret += 'var ' + name + ' = ' + name + ' || {};\n';
  }
  for (var key in module) {
    var subName = name + '.' + key;
    if (typeof(module[key]) == 'function') {
      ret += subName + ' = ' + module[key].toString() + ';\n';
      ret += content._dumpModule(subName, module[key], true);
      ret += content._dumpModule(
          subName + '.prototype', module[key].prototype, true);
    } else if (typeof(module[key]) == 'object' && module[key] !== null) {
      ret += subName +  ' = {};\n';
      ret += content._dumpModule(subName, module[key], true);
    } else {
      console.log('[ERROR] _dumpModule -- Unsupport type');
    }
  }
  return ret;
};


content.main();  //!< Go!!
