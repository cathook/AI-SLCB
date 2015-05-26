var api = api || {};  //!< @namespace api


/*!
 * @function Initializes this module.
 *
 * @param [in] util The dependency module `util`.
 * @param [in] math The dependency module `math`.
 * @param [in] mark The dependency module `mark`.
 */
api.init = function(util, math, mark) {
  api.agar.init(util, math);


  api.Position = math.Vector2D;


  /*!
   * @struct A game player.
   *
   * @var name The name of this player.
   * @var circles A list of bodies of this player.
   */
  api.Player = function(name, circles) {
    this.name = name;
    this.circles = circles;
  };


  /*!
   * @struct A round body.
   *
   * @var center The center of the circle.
   * @var radius The radius of the circle.
   * @var velocity The current velocity of this body.
   */
  api.CircleInfo = api.agar.CircleInfo;


  /*!
   * @struct An arrow.
   */
  api.MarkArrow = mark.Arrow;

  /*!
   * @struct A mark point.
   */
  api.MarkPoint = mark.Point;


  /*!
   * @struct A circle.
   */
  api.MarkCircle = mark.Circle;


  /*!
   * @struct A mesh.
   */
  api.MarkMesh = mark.Mesh;


  /*!
   * @function Sets the name.
   *
   * @param [in] name The name.
   */
  api.setSelfName = function(name) {
    api.agar.setSelfName(name);
  };


  /*!
   * @function Sets the region to join.
   *
   * @param [in] region The region.
   */
  api.setRegion = function(region) {
    api.agar.setRegion(region);
  };


  /*!
   * @function Sets the target position.
   *
   * @param [in] pos An instance of api.Position.
   * @param [in] useWindowCoord An optional argument, specifies whether this
   *     function should treat `pos` as the window coordinate or not.
   */
  api.setTargetPosition = function(pos, useWindowCoord) {
    if (!api._userMode) {
      if (useWindowCoord !== true) {
        pos = api.agar.toWindowCoord(pos);
      }
      api.agar.mouseMove({clientX : pos.x, clientY : pos.y});
    }
  };


  /*!
   * @function Splits the agent.
   */
  api.split = function() {
    if (!api._userMode) {
      api.agar.keyDown({keyCode : 32});
      window.setTimeout(function() { api.agar.keyUp({keyCode : 32}); }, 100);
    }
  };


  /*!
   * @function Lets the agent attack by throwing an little circle.
   */
  api.attack = function() {
    if (!api._userMode) {
      api.agar.keyDown({keyCode : 87});
      window.setTimeout(function() { api.agar.keyUp({keyCode : 87}); }, 100);
    }
  };


  /*!
   * @function Gets our agent's information.
   *
   * @return An instance of api.Player.
   */
  api.getSelf = function() {
    var ret = new api.Player('unknown', api.agar.getOurCirclesInfo());
    if (ret.circles.length > 0) {
      ret.name = ret.circles[0].name;
    }
    return ret;
  };


  /*!
   * @function Gets foods information.
   *
   * @return A list of instance of api.CircleInfo.
   */
  api.getFoods = function() {
    var minRadius = api._getMinRadius(api.agar.getOurCirclesInfo());
    var ret = [];
    for (var i = 0, cs = api.agar.getOtherCirclesInfo(); i < cs.length; ++i) {
      if (cs[i].radius < minRadius) {
        ret.push(cs[i]);
      }
    }
    return ret;
  };


  /*!
   * @function Gets spikes information.
   *
   * @return A list of instance of api.CircleInfo.
   */
  api.getSpikes = function() {
    return api.agar.getSpikeCirclesInfo();
  };


  /*!
   * @function Gets opponents information.
   *
   * @return A list of api.Player.
   */
  api.getOpponents = function() {
    var minRadius = api._getMinRadius(api.agar.getOurCirclesInfo());
    var oppns = {};
    for (var i = 0, cs = api.agar.getOtherCirclesInfo(); i < cs.length; ++i) {
      if (cs[i].radius >= minRadius) {
        if (!oppns.hasOwnProperty(cs[i].name)) {
          oppns[cs[i].name] = [];
        }
        oppns[cs[i].name].push(cs[i]);
      }
    }
    var ret = [];
    for (var name in oppns) {
      ret.push(new api.Player(name, oppns[name]));
    }
    return ret;
  };



  /*!
   * @function Get all informations, including self, spikes, foods, opponents.
   *
   * @return A dict contains:
   *     self: The self agent information.
   *     spikes: A list of spike circles.
   *     foods: A list of food circles.
   *     opponents: A list of opponent players.
   */
  api.getAll = function() {
    var ret = {self : api.getSelf(),
               spikes : api.getSpikes(),
               foods : [],
               opponents : []};
    var oppns = {};
    var minRadius = api._getMinRadius(ret.self.circles);
    for (var i = 0, cs = api.agar.getOtherCirclesInfo(); i < cs.length; ++i) {
      if (cs[i].radius < minRadius) {
        ret.foods.push(cs[i]);
      } else {
        if (!oppns.hasOwnProperty(cs[i].name)) {
          oppns[cs[i].name] = [];
        }
        oppns[cs[i].name].push(cs[i]);
      }
    }
    for (var name in oppns) {
      ret.opponents.push(new api.Player(name, oppns[name]));
    }
    return ret;
  };


  /*!
   * @function Gets the map size.
   *
   * @return The coordinate of the right-bottom corner.
   */
  api.getWorldSize = function() { return api.agar.getWorldSize(); };


  /*!
   * @function Gets the dangerous range.
   *
   * @return The max distance can the bad guy boost if it splits.
   */
  api.getDangerRadius = function() {
    return api.agar.getDangerRadius();
  };


  /*!
   * @function Gets little radius if it splits.
   *
   * @param [in] radius The radius to estimate.
   *
   * @return A number.
   */
  api.getSplittedRadius = function(radius) {
    return api.agar.getSplittedRadius(radius);
  };


  /*!
   * @function Gets the window size.
   *
   * @return An instance of math.Vector2D, where `x` be the width and `y` be
   *     the height.
   */
  api.getWindowSize = function() {
    return api.agar.getWindowSize();
  };


  /*!
   * @function Transforms the window coord to the world coordinate.
   *
   * @param [in] coord The window coordinate.
   */
  api.toWorldCoord = function(coord) {
    return api.agar.toWorldCoord(coord);
  };


  /*!
   * @function Adds a mark to draw on the canvas.
   *
   * @param [in] m An instance of one of the Point, Circle, Arrow.
   */
  api.addMark = function(m) { api._marks.add(m); };


  /*!
   * @function Removes a mark.
   *
   * @param [in] m An instance of one of the Point, Circle, Arrow.
   */
  api.removeMark = function(m) { api._marks.remove(m); };


  /*!
   * @function Adds a background mark to draw on the canvas.
   *
   * @param [in] m An instance of one of the Point, Circle, Arrow.
   */
  api.addBackgroundMark = function(m) { api._backgroundMarks.add(m); };


  /*!
   * @function Removes a background mark.
   *
   * @param [in] m An instance of one of the Point, Circle, Arrow.
   */
  api.removeBackgroundMark = function(m) { api._backgroundMarks.remove(m); };


  /*!
   * @function Register a keyboard handler for specified key.
   *
   * @param [in] chr The key.
   * @param [in] handler The handler.
   */
  api.registerKeyboardHandler = function(chr, handler) {
    if (typeof(chr) == 'string') {
      for (var i = 0; i < chr.length; ++i) {
        api.registerKeyboardHandler(chr.charCodeAt(i), handler);
      }
    } else {
      api._keydownHandlers[chr] = handler;
    }
  };


  /*!
   * @function Switches to user mode.
   */
  api.switchToUserMode = function() { api._userMode = true; };


  /*!
   * @function Switches to AI mode.
   */
  api.switchToAIMode = function() { api._userMode = false; };


  /*!
   * @function Gets whether it is user mode now.
   */
  api.isUserMode = function() { return api._userMode; };


  /*!
   * @function Sets the drawing mode.
   *
   * @param [in] options A dict stores options:
   *     direction: true/false
   *     safeCircle: true/false
   *     attackRange: true/false
   *     opponentsAttackRange: true/false
   */
  api.setDrawingMode = function(options) {
    if (options.hasOwnProperty('direction')) {
      api._drawDirection = options.direction;
    }
    if (options.hasOwnProperty('safeCircle')) {
      api._drawSafeCircle = options.safeCircle;
    }
    if (options.hasOwnProperty('attackRange')) {
      api._drawAttackRange = options.attackRange;
    }
    if (options.hasOwnProperty('opponentsAttackRange')) {
      api._drawOpponentsAttackRange = options.opponentsAttackRange;
    }
  };

  /*!
   * @function MouseMove event handler for window.
   *
   * @param [in] evt The event.
   */
  api._mousemoveHandler = function(evt) {
    if (api._userMode) {
      api.agar.mouseMove(evt);
    }
  };


  /*!
   * @function KeyDown event handler for window.
   *
   * @param [in] evt The event.
   */
  api._keydownHandler = function(evt) {
    if (api._keydownHandlers.hasOwnProperty(evt.keyCode)) {
      api._keydownHandlers[evt.keyCode](evt);
    }
    if (api._userMode) {
      api.agar.keyDown(evt);
    }
  };


  /*!
   * @function KeyUp event handler for window.
   *
   * @param [in] evt The event.
   */
  api._keyupHandler = function(evt) {
    if (api._userMode) {
      api.agar.keyUp(evt);
    }
  };


  /*!
   * @function Returns the miniamum radius of a list of circles.
   */
  api._getMinRadius = function(circles) {
    var r = Number.POSITIVE_INFINITY;
    for (var i = 0; i < circles.length; ++i) {
      r = Math.min(r, circles[i].radius);
    }
    return r;
  };


  /*!
   * @function Draws all the marks.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._draw = function(canvas) {
    api._tryDrawDirection(canvas);
    api._tryDrawSafeCircles(canvas);
    api._tryDrawAttackRange(canvas);
    api._tryDrawOpponentsAttackRange(canvas);
    api._marks.forEach(function(m) { m.draw(canvas); });
  };


  /*!
   * @function Draws all the background marks.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._drawBackground = function(canvas) {
    api._backgroundMarks.forEach(function(m) { m.draw(canvas); });
  };


  /*!
   * @function Draws the direction of each circle range if needs.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._tryDrawDirection = function(canvas) {
    if (api._drawDirection) {
      var drawForEach = function(lst) {
        for (var i = 0; i < lst.length; ++i) {
          if (lst[i].velocity.length() < 0.000001) {
            continue;
          }
          var v = lst[i].velocity.normalize().times(50);
          var a = new mark.Arrow(lst[i].center, lst[i].center.add(v),
                                 '#000000', mark.LineStyle.SOLID);
          a.draw(canvas);
        }
      };
      drawForEach(api.agar.getOurCirclesInfo());
      drawForEach(api.agar.getSpikeCirclesInfo());
      drawForEach(api.agar.getOtherCirclesInfo());
    }
  };


  /*!
   * @function Draws our circle safe range if needs.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._tryDrawSafeCircles = function(canvas) {
    if (api._drawSafeCircle) {
      for (var i = 0, lst = api.agar.getOurCirclesInfo(); i < lst.length; ++i) {
        var c = new mark.Circle(lst[i].center, api.agar.getDangerRadius(),
                                '#000000', mark.LineStyle.DOTTED);
        c.draw(canvas);
      }
    }
  };


  /*!
   * @function Draws our circle's attack range if needs.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._tryDrawAttackRange = function(canvas) {
    if (api._drawAttackRange) {
      api._drawCirclesAttackRange(canvas, api.agar.getOurCirclesInfo());
    }
  };


  /*!
   * @function Draws opponent circle's attack range if needs.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api._tryDrawOpponentsAttackRange = function(canvas) {
    if (api._drawOpponentsAttackRange) {
      api._drawCirclesAttackRange(canvas, api.agar.getOtherCirclesInfo());
    }
  };


  /*!
   * @function Draws a list of circle's attack range.
   *
   * @param [in] canvas The canvas to draw on.
   * @param [in] circles A list of circles.
   */
  api._drawCirclesAttackRange = function(canvas, circles) {
    for (var i = 0; i < circles.length; ++i) {
      var r2 = api.agar.getSplittedRadius(circles[i].radius);
      var v = circles[i].velocity;
      if (v < 0.00001) {
        v = new math.Vector2D(api.agar.getDangerRadius(), 0);
      } else {
        v = v.normalize().times(api.agar.getDangerRadius());
      }
      var u = v.toRight().normalize().times(r2);
      var marks = [];
      marks.push(new mark.Circle(circles[i].center, r2,
                                 '#AA0000', mark.LineStyle.DOTTED));
      marks.push(new mark.Circle(circles[i].center.add(v), r2,
                                 '#AA0000', mark.LineStyle.DOTTED));
      marks.push(new mark.Line(circles[i].center.add(u),
                               circles[i].center.add(u).add(v),
                               '#AA0000', mark.LineStyle.DOTTED));
      marks.push(new mark.Line(circles[i].center.minus(u),
                               circles[i].center.minus(u).add(v),
                               '#AA0000', mark.LineStyle.DOTTED));
      for (var i = 0; i < marks.length; ++i) {
        marks[i].draw(canvas);
      }
    }
  };


  /*!
   * @var Stores all the keydown handlers.
   */
  api._keydownHandlers = {};


  /*!
   * @var Whether it is user mode or not.
   */
  api._userMode = false;


  /*!
   * @var Whether it should draws the direction arrow for each circles.
   */
  api._drawDirection = false;


  /*!
   * @var Whether it should draws a circle with radius be `getDangerRadius()`
   */
  api._drawSafeCircle = false;


  /*!
   * @var bla bla.
   */
  api._drawOurAttackRange = false;


  /*!
   * @var bla bla.
   */
  api._drawOpponentsAttackRange = false;


  /*!
   * @var List of marks.
   */
  api._marks = new util.Set();


  /*!
   * @var List of marks.
   */
  api._backgroundMarks = new util.Set();


  api.agar.addDrawFunc(api._draw);
  api.agar.addDrawBeforeFunc(api._drawBackground);

  window.onkeydown = api._keydownHandler;
  window.onkeyup = api._keyupHandler;
  window.onmousemove = api._mousemoveHandler;
};
