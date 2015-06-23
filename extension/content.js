var extension = extension || {};  //!< namespace extension


/*!
 * @function Event handler for window's onload event.
 */
extension.initFunc = function() {
  util.init();
  math.init(util);
  mark.init(util, math);
  api.init(util, math, mark);
  ai.init(util, math, mark, api);

  api.registerKeyboardHandler('aA', function() {
    if (api.isUserMode()) {
      api.switchToAIMode();
      ai.start();
    } else {
      api.switchToUserMode();
      ai.stop();
    }
  });

  api.setDrawingMode({direction : true,
                      safeCircle : true,
                      attackRange : true,
                      opponentsAttackRange : false});

  api.setSelfName('AI');
  api.setRegion('JP-Tokyo');

  ai.setAgent(new ai.GongJiGuay());
  ai.start();
};


/*!
 * @function Extension's entry point.
 */
extension.main = function() {
  util.init();
  module.init(util);

  var code = '';
  code += module.dumpModules(new module.Module('util', util),
                             new module.Module('math', math),
                             new module.Module('mark', mark),
                             new module.Module('api', api),
                             new module.Module('ai', ai));
  code += 'window.onload = ' + extension.initFunc.toString() + ';\n';

  extension._insertJS(code);
};


/*!
 * @function Inserts a peace of javascript code tag.
 *
 * @param [in] code The code.
 */
extension._insertJS = function(code) {
  if (typeof document == 'undefined') {
    console.log(code);
    return;
  }

  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.innerHTML = code;

  var htmls = document.getElementsByTagName('html');
  htmls[htmls.length - 1].appendChild(script);
};


extension.main();  //!< Go!!
