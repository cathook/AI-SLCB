var math = math || {};  //!< @namespace math


/*!
 * @function Initializes this module.
 */
math.init = function() {
  /*!
   * @class A 2D vector.
   *
   * @var x The x scalar.
   * @var y The y scalar.
   */
  math.Vector2D = function() {
    if (arguments.length == 0) {
      math.Vector2D.call(this, 0, 0);
    } else if (arguments.length == 1) {
      math.Vector2D.call(this, arguments[0].x, arguments[0].y);
    } else {
      this.x = arguments[0];
      this.y = arguments[1];
    }
  };

  /*!
   * @function Clone this instance.
   *
   * @return An instance of math.Vector2D.
   */
  math.Vector2D.prototype.clone = function() {
    return new math.Vector2D(this);
  };

  /*!
   * @function Copies the x, y data from another instance of math.Vector2D.
   *
   * @param [in] t The gived instance of math.Vector2D.
   *
   * @return this.
   */
  math.Vector2D.prototype.copyFrom = function(t) {
    this.x = t.x;
    this.y = t.y;
    return this;
  }

  /*!
   * @function operator+
   *
   * @param [in] t Another 2D vector.
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.add = function(v2) {
    return (new math.Vector2D(this)).addToThis(v2);
  };

  /*!
   * @function operator+=
   *
   * @param [in] t Another 2D vector.
   *
   * @return this.
   */
  math.Vector2D.prototype.addToThis = function(v2) {
    this.x += v2.x;
    this.y += v2.y;
    return this;
  };

  /*!
   * @function operator-
   *
   * @param [in] t Another 2D vector.
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.minus = function(v2) {
    return (new math.Vector2D(this)).minusToThis(v2);
  };

  /*!
   * @function operator-=
   *
   * @param [in] t Another 2D vector.
   *
   * @return this.
   */
  math.Vector2D.prototype.minusToThis = function(v2) {
    this.x -= v2.x;
    this.y -= v2.y;
    return this;
  };

  /*!
   * @function operator*
   *
   * @param [in] t A scalar value.
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.times = function(s) {
    return (new math.Vector2D(this)).timesToThis(s);
  };

  /*!
   * @function operator*=
   *
   * @param [in] t A scalar value.
   *
   * @return this.
   */
  math.Vector2D.prototype.timesToThis = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
  };

  /*!
   * @function operator/
   *
   * @param [in] t A scalar value.
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.div = function(s) {
    return (new math.Vector2D(this)).divToThis(s);
  };

  /*!
   * @function operator/=
   *
   * @param [in] t A scalar value.
   *
   * @return this.
   */
  math.Vector2D.prototype.divToThis = function(s) {
    this.x /= s;
    this.y /= s;
    return this;
  };

  /*!
   * @function Returns an vector which is the normalized one of this vector.
   *
   * @return An instance of Vector2D.
   */
  math.Vector2D.prototype.normalize = function() {
    return this.div(this.length());
  };

  /*!
   * @function Normailzes itself.
   *
   * @return this.
   */
  math.Vector2D.prototype.normalizeToThis = function() {
    return this.divToThis(this.length());
  };

  /*!
   * @function Calculates the dot operator with another vector.
   *
   * @param [in] v2 The another vector.
   * @return The result of "this dot v2".
   */
  math.Vector2D.prototype.dot = function(v2) {
    return this.x * v2.x + this.y * v2.y;
  };

  /*!
   * @function Calculates the cross operator with another vector.
   *
   * @param [in] v2 The another vector.
   * @return The result of "this cross v2".
   */
  math.Vector2D.prototype.cross = function(v2) {
    return this.x * v2.y - this.y * v2.x;
  };

  /*!
   * @function Calculates the square of the length of this vector.
   *
   * @return The square of the length of this vector.
   */
  math.Vector2D.prototype.length2 = function() {
    return this.dot(this);
  };

  /*!
   * @function Calculates the length of this vector.
   *
   * @return The length of this vector.
   */
  math.Vector2D.prototype.length = function() {
    return Math.sqrt(this.length2());
  };

  /*!
   * @function Calculates the angle between this vector and x-axis.
   *
   * @return A value between 0 to 2 * pi.
   */
  math.Vector2D.prototype.angle = function() {
    var ang = Math.atan2(this.y, this.x), c = Math.PI * 2.0;
    while (ang >= c) ang -= c;
    while (ang < 0) ang += c;
    return ang;
  };

  /*!
   * @function Returns an vector which is the result of rotate this vector 90
   *     degree in counter-colockwise.
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.toRight = function() {
    return new math.Vector2D(-this.y, this.x);
  };

  /*!
   * @function Rotates itself 90 degree in counter-clockwise.
   *
   * @return this.
   */
  math.Vector2D.prototype.toRightToThis = function() {
    return this.copyFrom(this.toRight());
  };

  /*!
   * @function ...
   *
   * @return The result vector.
   */
  math.Vector2D.prototype.rotate = function(ang) {
    var i = new math.Vector2D(Math.cos(-ang), Math.sin(-ang)), j = i.toRight();
    return new math.Vector2D(this.dot(i), this.dot(j));
  };

  /*!
   * @function Rotates itself a certen degree in counter-clockwise.
   *
   * @param [in] ang The angle in rad.
   *
   * @return this.
   */
  math.Vector2D.prototype.rotateToThis = function(ang) {
    return this.copyFrom(this.rotate(ang));
  };

  /*!
   * @function Transform this vector to a string.
   *
   * @return A stirng.
   */
  math.Vector2D.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
  };
};
