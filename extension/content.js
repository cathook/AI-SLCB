var content = content || {};  //!< namespace content


//! @brief Event handler for window's onload event.
content.initFunc = function() {
  api.init();
};


//! @brief Extension's entry point.
content.main = function() {
  var code = '';
  code += 'var api = {};\n';
  code += 'api.init = ' + api.init.toString() + ';\n';
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


content.main();  //!< Go!!
