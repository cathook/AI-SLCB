var extension = extension || {};  //!< namespace extension


//! @brief Event handler for window's onload event.
extension.initFunc = function() {
  api.init();
  ai.esiguay.start();

  api.registerKeyboardHandler(
      'mM', function() { api.setIsUserOwnMove(!api.isUserOwnMove()); });
  api.registerKeyboardHandler(
      'aA', function() { api.setIsUserOwnAttack(!api.isUserOwnAttack()); });
  api.registerKeyboardHandler(
      'sS', function() { api.setIsUserOwnSplit(!api.isUserOwnSplit()); });

  api.setSelfName('default name');
};


//! @brief Extension's entry point.
extension.main = function() {
  var code = '';
  code += util.dumpModules(new util.Module('util', util),
                           new util.Module('api', api),
                           new util.Module('ai', ai));
  code += 'window.onload = ' + extension.initFunc.toString() + ';\n';

  extension._insertJS(code);
};


//! @brief Inserts a peace of javascript code tag.
//! @param [in] code The code.
extension._insertJS = function(code) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.innerHTML = code;

  var htmls = document.getElementsByTagName('html');
  htmls[htmls.length - 1].appendChild(script);
};


extension.main();  //!< Go!!
