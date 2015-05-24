var mark = mark || {};  //!< @namespace mark


/*!
 * @function Initializes this module.
 *
 * @param [in] util The dependency module `util`.
 * @param [in] math The dependency module `math`.
 */
mark.init = function(util, math) {
  /*!
   * @class Base class for a mark.
   */
  mark.Mark = function() {};

  /*!
   * @function Draws this mark.
   *
   * @param [in] canvas The canvas to draw on.
   */
  mark.Mark.prototype.draw = function(canvas) {
    throw util.NoImplementation();
  };


  /*!
   * @enum Types of style of a line.
   *
   * @var DASH Dotted line.
   * @var SOLID Solid line.
   */
  mark.LineStyle = new util.Enum('DOTTED', 'SOLID');


  /*!
   * @class An arrow.
   *
   * @var from The start position.
   * @var to The end position.
   * @var color The color of this arrow.
   * @var type Line style, one of the element of `mark.LineStyle`.
   */
  mark.Arrow = function(from, to, color, type) {
    this.from = from;
    this.to = to;
    this.color = color;
    this.type = type;
  };

  util.setInheritFrom(mark.Arrow, mark.Mark);

  mark.Arrow.prototype.draw = function(canvas) {
    var v = this.from.minus(this.to).div(3);

    mark._canvasBeginPath(canvas, this.color, 10, this.type);
    canvas.lineCap = 'round';
    mark._drawLine(canvas, this.from, this.to);
    mark._drawLine(canvas, this.to, this.to.add(v.rotate( Math.PI / 6)));
    mark._drawLine(canvas, this.to, this.to.add(v.rotate(-Math.PI / 6)));
    mark._canvasEndPath(canvas);
  };


  /*!
   * @class A point.
   *
   * @var position The position of this point.
   * @var color Color of this point.
   * @var type Type of this point, one of the element of `mark.Point.Type`.
   */
  mark.Point = function(pos, color, type) {
    this.position = pos;
    this.color = color;
    this.type = type;
  };

  /*!
   * @enum Types of point.
   *
   * @var TARGET It will be drawn likes a front sight of a gun.
   * @var X It will be drawn likes the character `X`.
   */
  mark.Point.Type = new util.Enum('TARGET', 'X');

  util.setInheritFrom(mark.Point, mark.Mark);

  mark.Point.prototype.Type = mark.Point.Type;

  mark.Point.prototype.draw = function(canvas) {
    mark._canvasBeginPath(canvas, this.color, 5, mark.LineStyle.SOLID);
    if (this.type == this.Type.TARGET) {
      var r = 40, i = new math.Vector2D(r, 0), j = new math.Vector2D(0, r);
      mark._drawLine(canvas, this.position.add(i), this.position.minus(i));
      mark._drawLine(canvas, this.position.add(j), this.position.minus(j));
      mark._drawCircle(canvas, this.position, r / 2);
    } else if (this.type == this.Type.X) {
      var r = 30, i = new math.Vector2D(r, r), j = new math.Vector2D(-r, r);
      mark._drawLine(canvas, this.position.add(i), this.position.minus(i));
      mark._drawLine(canvas, this.position.add(j), this.position.minus(j));
    }
    mark._canvasEndPath(canvas);
  };


  /*!
   * @class A circle.
   *
   * @var center Center of this cricle.
   * @var radius Radius of this circle.
   * @var color Color of this circle.
   * @var type Type of the line.
   */
  mark.Circle = function(center, radius, color, type) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.type = type;
  };

  util.setInheritFrom(mark.Circle, mark.Mark);

  mark.Circle.prototype.draw = function(canvas) {
    mark._canvasBeginPath(canvas, this.color, 10, this.type);
    mark._drawCircle(canvas, this.center, this.radius);
    mark._canvasEndPath(canvas);
  };


  /*!
   * @class A mesh.
   *
   * @var ltCorner The left-top corner.
   * @var rbCorner The right-bottom corner.
   * @var distance The distance between two dot.
   * @var colorFunc A function wich will output the color of the dot by giving
   *     it the position of that dot.
   */
  mark.Mesh = function(ltCorner, rbCorner, distance, colorFunc) {
    this.ltCorner = ltCorner;
    this.rbCorner = rbCorner;
    this.distance = distance;
    this.colorFunc = colorFunc;
  };

  util.setInheritFrom(mark.Mesh, mark.Mark);

  mark.Mesh.prototype.draw = function(canvas) {
    var v = new math.Vector2D();
    var r = 5;
    canvas.save();
    canvas.lineWidth = 0;
    for (v.x = this.ltCorner.x; v.x <= this.rbCorner.x; v.x += this.distance) {
      for (v.y = this.ltCorner.y; v.y <= this.rbCorner.y; v.y += this.distance) {
        canvas.fillStyle = this.colorFunc(v);
        mark._drawCircle(canvas, v, r);
        canvas.fill();
      }
    }
    canvas.restore();
  };


  /*!
   * @function Setups options for canvas and begins the path drawing process.
   *
   * @param [in] canvas The canvas to draw on.
   * @param [in] color Color of the line.
   * @param [in] lineWidth The line width.
   * @param [in] type The style of the line, an element of `mark.LineStyle`.
   */
  mark._canvasBeginPath = function(canvas, color, lineWidth, type) {
    canvas.save();
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    if (type == mark.LineStyle.DOTTED) {
      canvas.setLineDash([5, 15]);
    }
    canvas.beginPath();
  };


  /*!
   * @function Ends the path drawing process.
   *
   * @param [in] canvas The canvas to draw on.
   */
  mark._canvasEndPath = function(canvas) {
    canvas.stroke();
    canvas.restore();
  };


  /*!
   * @function Draws a line.
   *
   * @param [in] a The start point of this line.
   * @param [in] b The end point of this line.
   */
  mark._drawLine = function(canvas, a, b) {
    canvas.moveTo(a.x, a.y);
    canvas.lineTo(b.x, b.y);
  };


  /*!
   * @function Draws a line.
   *
   * @param [in] canvas The canvas to draw on.
   * @param [in] c The center of this circle.
   * @param [in] r The radius of this circle.
   */
  mark._drawCircle = function(canvas, c, r) {
    canvas.moveTo(c.x + r, c.y);
    canvas.arc(c.x, c.y, r, 0, Math.PI * 2);
  };
};
