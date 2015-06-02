var api = api || {};  //!< @namespace api

api.agar = api.agar || {};  //!< @namespace api.agar


/*!
 * @function Initializes this module.
 *
 * @param [in] util The dependency module `util`.
 * @param [in] math The dependency module `math`.
 */
api.agar.init = function(util, math) {
  /*!
   * @struct A round body.
   *
   * @var name The name of this body.
   * @var center The center of the circle.
   * @var radius The radius of the circle.
   * @var velocity The current velocity of this body.
   * @var _delta The (nx, ny) minus (ox, oy)
   * @var _t0 t
   */
  api.agar.CircleInfo = function(agarCircle) {
    this.name = agarCircle.name;
    this.center = new math.Vector2D(agarCircle.x, agarCircle.y);
    this.radius = agarCircle.size;
    this._delta = new math.Vector2D(agarCircle.nx - agarCircle.ox,
                                    agarCircle.ny - agarCircle.oy);
    this._t0 = agarCircle.updateTime;

    this.velocity = null;
    this.updateVelocity();
  };

  /*!
   * @function Updates the velocity to the current time.
   */
  api.agar.CircleInfo.prototype.updateVelocity = function() {
    var t = Math.max(0, Math.min(1, ((+new Date()) - this._t0) / 120));
    var u = -6 * t * t + 6 * t;  // f(t) = -2t^3 + 3t^2, df(t)/dt = -6t^2 + 6t
    this.velocity = this._delta.times(u);
  };


  /*!
   * @function Touches off an mousemove event.
   *
   * @param [in] evt The event object.
   */
  api.agar.mouseMove = function(evt) {
    api.agar._canvasEventHandlers.onmousemove(evt);
  };


  /*!
   * @function Touches off an keydown event.
   *
   * @param [in] evt The event object.
   */
  api.agar.keyDown = function(evt) {
    api.agar._windowEventHandlers.onkeydown(evt);
  };


  /*!
   * @function Touches off an keyup event.
   *
   * @param [in] evt The event object.
   */
  api.agar.keyUp = function(evt) {
    api.agar._windowEventHandlers.onkeyup(evt);
  };


  /*!
   * @function Sets the name.
   *
   * @param [in] name The name.
   */
  api.agar.setSelfName = function(name) {
    document.getElementById('nick').value = name;
  };


  /*!
   * @function Sets the region to join.
   *
   * @param [in] region The region.
   */
  api.agar.setRegion = function(region) {
    document.getElementById('region').value = region;
    document.getElementById('region').onchange();
  };


  /*!
   * @function Gets our circles information.
   */
  api.agar.getOurCirclesInfo = function() {
    api.agar._tryUpdateCirclesInfo(api.agar._ourCirclesInfo);
    return api.agar._ourCirclesInfo;
  };


  /*!
   * @function Gets spike circles information.
   */
  api.agar.getSpikeCirclesInfo = function() {
    api.agar._tryUpdateCirclesInfo(api.agar._spikeCirclesInfo);
    return api.agar._spikeCirclesInfo;
  };


  /*!
   * @function Gets other circles information.
   */
  api.agar.getOtherCirclesInfo = function() {
    api.agar._tryUpdateCirclesInfo(api.agar._otherCirclesInfo);
    return api.agar._otherCirclesInfo;
  };


  /*!
   * @function Gets the window size.
   *
   * @return An instance of math.Vector2D, where `x` be the width and `y` be
   *     the height.
   */
  api.agar.getWindowSize = function() {
    throw util.NoImplementation();
  };


  /*!
   * @function Gets the world coordinate of the center of the window.
   */
  api.agar.getWindowCenterCoord = function() {
    throw util.NoImplementation();
  };


  /*!
   * @function Gets the world scale.
   */
  api.agar.getScale = function() {
    throw util.NoImplementation();
  };


  /*!
   * @function Gets the world size.
   *
   * @return An instance of api.agar.Position, which x be the width and y be the
   *     height of the world.
   */
  api.agar.getWorldSize = function() {
    return new math.Vector2D(11180, 11180);
  };


  /*!
   * @function Gets the maximux attack distance by the given radius.
   *
   * @param [in] radius The radius to estimeate.
   *
   * @return A number.
   */
  api.agar.getDangerRadius = function() {
    return 800;
  };


  /*!
   * @function Gets little radius if it splits.
   *
   * @param [in] radius The radius to estimate.
   *
   * @return A number.
   */
  api.agar.getSplittedRadius = function(radius) {
    return radius / Math.sqrt(2);
  };


  /*!
   * @function Transforms the gived world coordinate to the window coordinate.
   *
   * @param [in] worldCoord The coordinate to be transformed.
   */
  api.agar.toWindowCoord = function(worldCoord) {
    var c = api.agar.getWindowCenterCoord();
    var s = api.agar.getScale();
    var w = api.agar.getWindowSize();
    return worldCoord.minus(c).times(s).add(w.div(2));
  };


  /*!
   * @function Transforms the gived window coordinate to the world coordinate.
   *
   * @param [in] coord The coordinate to be transformed.
   */
  api.agar.toWorldCoord = function(coord) {
    var c = api.agar.getWindowCenterCoord();
    var s = api.agar.getScale();
    var w = api.agar.getWindowSize();
    return coord.minus(w.div(2)).div(s).add(c);
  };


  /*!
   * @function Adds a function which will be called while rendering the canvas.
   *
   * @param [in] func The function with one argument, which is the canvas to draw
   *     on.
   */
  api.agar.addDrawFunc = function(func) {
    api.agar._drawFuncs.add(func);
  };


  /*!
   * @function Removes a function which will be called while rendering the canvas.
   *
   * @param [in] func The function to be removed.
   *     on.
   */
  api.agar.removeDrawFunc = function(func) {
    api.agar._drawFuncs.remove(func);
  };


  /*!
   * @function Adds a function which will be called while rendering the canvas.
   *
   * @param [in] func The function with one argument, which is the canvas to draw
   *     on.
   */
  api.agar.addDrawBeforeFunc = function(func) {
    api.agar._drawBeforeFuncs.add(func);
  };


  /*!
   * @function Removes a function which will be called while rendering the canvas.
   *
   * @param [in] func The function to be removed.
   *     on.
   */
  api.agar.removeDrawBeforeFunc = function(func) {
    api.agar._drawBeforeFuncs.remove(func);
  };


  /*!
   * @function Replaces the original event handlers.
   *
   * @param [in] w A reference to window.
   * @param [in] c A reference to canvas.
   */
  api.agar._replaceEventHandlers = function(w, c) {
    var forEach = function(lst, org, backupDict) {
      for (var i = 0; i < lst.length; ++i) {
        backupDict[lst[i]] = org[lst[i]];
        org[lst[i]] = null;
      }
    };
    forEach(['onkeydown', 'onkeyup', 'onblur'],
            w, api.agar._windowEventHandlers);
    forEach(['onmousemove', 'onmousedown'],
            c, api.agar._canvasEventHandlers);
  };


  /*!
   * @function Tries to update the circles information.
   */
  api.agar._tryUpdateCirclesInfo = function() {
    if (api.agar._circlesInfoChanged) {
      api.agar._updateCirclesInfo();
    } else {
      for (var i = 0; i < arguments.length; ++i) {
        for (var j = 0; j < arguments[i].length; ++j) {
          arguments[i][j].updateVelocity();
        }
      }
    }
  };

  /*!
   * @function Updates the circle informations.
   */
  api.agar._updateCirclesInfo = function() {
    throw util.NoImplementation();
  };


  /*!
   * @function Calls all the drawing functions.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api.agar._drawBefore = function(canvas) {
    api.agar._drawBeforeFuncs.forEach(function(func) { func(canvas); });
  };


  /*!
   * @function Calls all the drawing functions.
   *
   * @param [in] canvas The canvas to draw on.
   */
  api.agar._draw = function(canvas) {
    api.agar._drawFuncs.forEach(function(func) { func(canvas); });
  };


  /*!
   * @var Contains all the original window's event handlers.
   */
  api.agar._windowEventHandlers = {};


  /*!
   * @var Contains all the original canvas' event handlers.
   */
  api.agar._canvasEventHandlers = {};


  /*!
   * @var Whether the circles information are changed or not.
   */
  api.agar._circlesInfoChanged = false;


  /*!
   * @var Caches our circles' information.
   */
  api.agar._ourCirclesInfo = [];


  /*!
   * @var Caches spike circles' information.
   */
  api.agar._spikeCirclesInfo = [];


  /*!
   * @var Caches other circles' information.
   */
  api.agar._otherCirclesInfo = [];


  /*!
   * @var A set of functions.
   */
  api.agar._drawBeforeFuncs = new util.Set();


  /*!
   * @var A set of functions.
   */
  api.agar._drawFuncs = new util.Set();


  //////////////////////////////////////////////////////////
  //
  // The codes below is the original agar.io's main js code.
  //
  // Note: The lines we insert for opening some backdoor will
  //     be followed a comment "meow".
  //
  //////////////////////////////////////////////////////////
  f = window;
  g = jQuery;

  function Ha() {
    fa = !0;
    oa();
    setInterval(oa, 18E4);
    A = ga = document.getElementById("canvas");
    e = A.getContext("2d");
    A.onmousedown = function(a) {
      if (pa) {
        var b = a.clientX - (5 + q / 5 / 2),
          c = a.clientY - (5 + q / 5 / 2);
        if (Math.sqrt(b * b + c * c) <= q / 5 / 2) {
          J();
          B(17);
          return
        }
      }
      R = a.clientX;
      S = a.clientY;
      ha();
      J()
    };
    A.onmousemove = function(a) {
      R = a.clientX;
      S = a.clientY;
      ha()
    };
    A.onmouseup = function(a) {};
    /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", qa, !1) : document.body.onmousewheel = qa;
    var a = !1,
      b = !1,
      c = !1;
    f.onkeydown = function(d) {
      32 != d.keyCode || a || (J(), B(17), a = !0);
      81 != d.keyCode || b || (B(18), b = !0);
      87 != d.keyCode || c || (J(), B(21), c = !0);
      27 == d.keyCode && ra(!0)
    };
    f.onkeyup = function(d) {
      32 == d.keyCode && (a = !1);
      87 == d.keyCode && (c = !1);
      81 == d.keyCode && b && (B(19), b = !1)
    };
    f.onblur = function() {
      B(19);
      c = b = a = !1
    };
    f.onresize = sa;

    api.agar._replaceEventHandlers(f, A);  // meow

    sa();
    f.requestAnimationFrame ? f.requestAnimationFrame(ta) : setInterval(ia, 1E3 / 60);
    setInterval(J, 40);
    u && g("#region").val(u);
    ua();
    T(g("#region").val());
    null == m && u && U();
    g("#overlays").show()
  }

  function qa(a) {
    C *= Math.pow(.9, a.wheelDelta / -120 || a.detail || 0);
    1 > C && (C = 1);
    C > 4 / h && (C = 4 / h)
  }

  function Ia() {
    if (.35 > h) K = null;
    else {
      for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = Number.NEGATIVE_INFINITY, e = 0, p = 0; p < n.length; p++) n[p].shouldRender() && (e = Math.max(n[p].size, e), a = Math.min(n[p].x, a), b = Math.min(n[p].y, b), c = Math.max(n[p].x, c), d = Math.max(n[p].y, d));
      K = QUAD.init({
        minX: a - (e + 100),
        minY: b - (e + 100),
        maxX: c + (e + 100),
        maxY: d + (e + 100)
      });
      for (p = 0; p < n.length; p++)
        if (a = n[p], a.shouldRender())
          for (b = 0; b < a.points.length; ++b) K.insert(a.points[b])
    }
  }

  function ha() {
    V = (R - q / 2) / h + s;
    W = (S - r / 2) / h + t
  }

  function oa() {
    null == X && (X = {}, g("#region").children().each(function() {
      var a = g(this),
        b = a.val();
      b && (X[b] = a.text())
    }));
    g.get("http://m.agar.io/info", function(a) {
      var b = {},
        c;
      for (c in a.regions) {
        var d = c.split(":")[0];
        b[d] = b[d] || 0;
        b[d] += a.regions[c].numPlayers
      }
      for (c in b) g('#region option[value="' + c + '"]').text(X[c] + " (" + b[c] + " players)")
    }, "json")
  }

  function va() {
    g("#adsBottom").hide();
    g("#overlays").hide();
    ua()
  }

  function T(a) {
    a && a != u && (g("#region").val() != a && g("#region").val(a),
      u = f.localStorage.location = a, g(".region-message").hide(), g(".region-message." + a).show(), g(".btn-needs-server").prop("disabled", !1), fa && U())
  }

  function ra(a) {
    D = null;
    g("#overlays").fadeIn(a ? 200 : 3E3);
    a || g("#adsBottom").fadeIn(3E3)
  }

  function ua() {
    g("#region").val() ? f.localStorage.location = g("#region").val() : f.localStorage.location && g("#region").val(f.localStorage.location);
    g("#region").val() ? g("#locationKnown").append(g("#region")) : g("#locationUnknown").append(g("#region"))
  }

  function wa() {
    console.log("Find " +
      u + L);
    g.ajax("http://m.agar.io/", {
      error: function() {
        setTimeout(wa, 1E3)
      },
      success: function(a) {
        a = a.split("\n");
        xa("ws://" + a[0])
      },
      dataType: "text",
      method: "POST",
      cache: !1,
      crossDomain: !0,
      data: u + L || "?"
    })
  }

  function U() {
    fa && u && (g("#connecting").show(), wa())
  }

  function xa(a) {
    if (m) {
      m.onopen = null;
      m.onmessage = null;
      m.onclose = null;
      try {
        m.close()
      } catch (b) {}
      m = null
    }
    E = [];
    l = [];
    y = {};
    n = [];
    F = [];
    z = [];
    v = w = null;
    G = 0;
    console.log("Connecting to " + a);
    m = new WebSocket(a);
    m.binaryType = "arraybuffer";
    m.onopen = Ja;
    m.onmessage = Ka;
    m.onclose = La;
    m.onerror = function() {
      console.log("socket error")
    }
  }

  function Ja(a) {
    Y = 500;
    g("#connecting").hide();
    console.log("socket open");
    a = new ArrayBuffer(5);
    var b = new DataView(a);
    b.setUint8(0, 254);
    b.setUint32(1, 4, !0);
    m.send(a);
    a = new ArrayBuffer(5);
    b = new DataView(a);
    b.setUint8(0, 255);
    b.setUint32(1, 1, !0);
    m.send(a);
    ya()
  }

  function La(a) {
    console.log("socket close");
    setTimeout(U, Y);
    Y *= 1.5
  }

  function Ka(a) {
    function b() {
      for (var a = "";;) {
        var b = d.getUint16(c, !0);
        c += 2;
        if (0 == b) break;
        a += String.fromCharCode(b)
      }
      return a
    }
    var c = 1,
      d = new DataView(a.data);
    switch (d.getUint8(0)) {
      case 16:
        Ma(d);
        break;
      case 17:
        M = d.getFloat32(1, !0);
        N = d.getFloat32(5, !0);
        O = d.getFloat32(9, !0);
        break;
      case 20:
        l = [];
        E = [];
        break;
      case 32:
        E.push(d.getUint32(1, !0));
        break;
      case 49:
        if (null != w) break;
        a = d.getUint32(c, !0);
        c += 4;
        z = [];
        for (var e = 0; e < a; ++e) {
          var p = d.getUint32(c, !0),
            c = c + 4;
          z.push({
            id: p,
            name: b()
          })
        }
        za();
        break;
      case 50:
        w = [];
        a = d.getUint32(c, !0);
        c += 4;
        for (e = 0; e < a; ++e) w.push(d.getFloat32(c, !0)), c += 4;
        za();
        break;
      case 64:
        Z = d.getFloat64(1, !0), $ = d.getFloat64(9, !0), aa = d.getFloat64(17, !0), ba = d.getFloat64(25, !0), M = (aa + Z) / 2, N = (ba + $) / 2, O = 1, 0 == l.length && (s = M, t = N, h = O)
    }
  }

  function Ma(a) {
    H = +new Date;

    api.agar._circlesInfoChanged = true;  // meow

    var b = Math.random(),
      c = 1;
    ja = !1;
    for (var d = a.getUint16(c, !0), c = c + 2, e = 0; e < d; ++e) {
      var p = y[a.getUint32(c, !0)],
        f = y[a.getUint32(c + 4, !0)],
        c = c + 8;
      p && f && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = p.x, f.ny = p.y, f.nSize = f.size, f.updateTime = H)
    }
    for (e = 0;;) {
      d = a.getUint32(c, !0);
      c += 4;
      if (0 == d) break;
      ++e;
      var g, p = a.getInt16(c, !0),
        c = c + 2,
        f = a.getInt16(c, !0),
        c = c + 2;
      g = a.getInt16(c, !0);
      for (var c = c + 2, h = a.getUint8(c++),
          m = a.getUint8(c++), q = a.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length;) h = "0" + h;
      var h = "#" + h,
        k = a.getUint8(c++),
        m = !!(k & 1),
        q = !!(k & 16);
      k & 2 && (c += 4);
      k & 4 && (c += 8);
      k & 8 && (c += 16);
      for (var n, k = "";;) {
        n = a.getUint16(c, !0);
        c += 2;
        if (0 == n) break;
        k += String.fromCharCode(n)
      }
      n = k;
      k = null;
      y.hasOwnProperty(d) ? (k = y[d], k.updatePos(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.color = h) : (k = new Aa(d, p, f, g, h, n), k.pX = p, k.pY = f);
      k.isVirus = m;
      k.isAgitated = q;
      k.nx = p;
      k.ny = f;
      k.nSize = g;
      k.updateCode = b;
      k.updateTime = H; - 1 != E.indexOf(d) && -1 == l.indexOf(k) && (document.getElementById("overlays").style.display = "none", l.push(k), 1 == l.length && (s = k.x, t = k.y))
    }
    b = a.getUint32(c, !0);
    c += 4;
    for (e = 0; e < b; e++) d = a.getUint32(c, !0), c += 4, k = y[d], null != k && k.destroy();
    ja && 0 == l.length && ra(!1)
  }

  function J() {
    if (ka()) {
      var a = R - q / 2,
        b = S - r / 2;
      64 > a * a + b * b || Ba == V && Ca == W || (Ba = V, Ca = W, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, V, !0), b.setFloat64(9, W, !0), b.setUint32(17, 0, !0), m.send(a))
    }
  }

  function ya() {
    if (ka() && null != D) {
      var a = new ArrayBuffer(1 + 2 * D.length),
        b = new DataView(a);
      b.setUint8(0, 0);
      for (var c = 0; c < D.length; ++c) b.setUint16(1 + 2 * c, D.charCodeAt(c), !0);
      m.send(a)
    }
  }

  function ka() {
    return null != m && m.readyState == m.OPEN
  }

  function B(a) {
    if (ka()) {
      var b = new ArrayBuffer(1);
      (new DataView(b)).setUint8(0, a);
      m.send(b)
    }
  }

  function ta() {
    ia();
    f.requestAnimationFrame(ta)
  }

  function sa() {
    q = f.innerWidth;
    r = f.innerHeight;
    ga.width = A.width = q;
    ga.height = A.height = r;
    ia()
  }

  function Da() {
    var a;
    a = 1 * Math.max(r / 1080, q / 1920);
    return a *= C
  }

  function Na() {
    if (0 != l.length) {
      for (var a = 0, b = 0; b < l.length; b++) a += l[b].size;
      a = Math.pow(Math.min(64 / a, 1), .4) * Da();
      h = (9 * h + a) / 10
    }
  }

  function ia() {
    var a, b, c = +new Date;
    ++Oa;
    H = +new Date;
    if (0 < l.length) {
      Na();
      for (var d = a = b = 0; d < l.length; d++) l[d].updatePos(), b += l[d].x / l.length, a += l[d].y / l.length;
      M = b;
      N = a;
      O = h;
      s = (s + b) / 2;
      t = (t + a) / 2
    } else s = (29 * s + M) / 30, t = (29 * t + N) / 30, h = (9 * h + O * Da()) / 10;
    Ia();
    ha();
    e.clearRect(0, 0, q, r);
    e.fillStyle = la ? "#111111" : "#F2FBFF";
    e.fillRect(0, 0, q, r);
    e.save();
    e.strokeStyle = la ? "#AAAAAA" : "#000000";
    e.globalAlpha = .2;
    e.scale(h, h);
    b = q / h;
    a = r / h;
    for (d = -.5 + (-s + b / 2) % 50; d < b; d += 50) e.beginPath(),
      e.moveTo(d, 0), e.lineTo(d, a), e.stroke();
    for (d = -.5 + (-t + a / 2) % 50; d < a; d += 50) e.beginPath(), e.moveTo(0, d), e.lineTo(b, d), e.stroke();
    e.restore();
    n.sort(function(a, b) {
      return a.size == b.size ? a.id - b.id : a.size - b.size
    });
    e.save();
    e.translate(q / 2, r / 2);
    e.scale(h, h);
    e.translate(-s, -t);

    api.agar._drawBefore(e);  // meow

    for (d = 0; d < F.length; d++) F[d].draw();
    for (d = 0; d < n.length; d++) n[d].draw();

    api.agar._draw(e);  // meow

    e.restore();
    v && v.width && e.drawImage(v, q - v.width - 10, 10);
    G = Math.max(G, Pa());
    0 != G && (null == ca && (ca = new da(24, "#FFFFFF")), ca.setValue("Score: " + ~~(G / 100)), a = ca.render(), b = a.width, e.globalAlpha = .2, e.fillStyle = "#000000", e.fillRect(10, r - 10 - 24 - 10, b + 10, 34), e.globalAlpha = 1, e.drawImage(a, 15, r - 10 - 24 - 5));
    Qa();
    c = +new Date - c;
    c > 1E3 / 60 ? x -= .01 : c < 1E3 / 65 && (x += .01);.4 > x && (x = .4);
    1 < x && (x = 1)
  }

  function Qa() {
    if (pa && ma.width) {
      var a = q / 5;
      e.drawImage(ma, 5, 5, a, a)
    }
  }

  function Pa() {
    for (var a = 0, b = 0; b < l.length; b++) a += l[b].nSize * l[b].nSize;
    return a
  }

  function za() {
    v = null;
    if (null != w || 0 != z.length)
      if (null != w || ea) {
        v = document.createElement("canvas");
        var a = v.getContext("2d"),
          b = 60,
          b = null == w ? b + 24 * z.length : b + 180,
          c = Math.min(200, .3 * q) / 200;
        v.width = 200 * c;
        v.height = b * c;
        a.scale(c, c);
        a.globalAlpha = .4;
        a.fillStyle = "#000000";
        a.fillRect(0, 0, 200, b);
        a.globalAlpha = 1;
        a.fillStyle = "#FFFFFF";
        c = null;
        c = "Leaderboard";
        a.font = "30px Ubuntu";
        a.fillText(c, 100 - a.measureText(c).width / 2, 40);
        if (null == w)
          for (a.font = "20px Ubuntu", b = 0; b < z.length; ++b) c = z[b].name || "An unnamed cell", ea || (c = "An unnamed cell"), -1 != E.indexOf(z[b].id) ? (l[0].name && (c = l[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width /
            2, 70 + 24 * b);
        else
          for (b = c = 0; b < w.length; ++b) angEnd = c + w[b] * Math.PI * 2, a.fillStyle = Ra[b + 1], a.beginPath(), a.moveTo(100, 140), a.arc(100, 140, 80, c, angEnd, !1), a.fill(), c = angEnd
      }
  }

  function Aa(a, b, c, d, e, f) {
    n.push(this);
    y[a] = this;
    this.id = a;
    this.ox = this.x = b;
    this.oy = this.y = c;
    this.oSize = this.size = d;
    this.color = e;
    this.points = [];
    this.pointsAcc = [];
    this.createPoints();
    this.setName(f)
  }

  function da(a, b, c, d) {
    a && (this._size = a);
    b && (this._color = b);
    this._stroke = !!c;
    d && (this._strokeColor = d)
  }

  if ("agar.io" != f.location.hostname && "localhost" != f.location.hostname && "10.10.2.13" != f.location.hostname) f.location = "http://agar.io/";
  else if (f.top != f) f.top.location = "http://agar.io/";
  else {
    var ga, e, A, q, r, K = null,
      m = null,
      s = 0,
      t = 0,
      E = [],
      l = [],
      y = {},
      n = [],
      F = [],
      z = [],
      R = 0,
      S = 0,
      V = -1,
      W = -1,
      Oa = 0,
      H = 0,
      D = null,
      Z = 0,
      $ = 0,
      aa = 1E4,
      ba = 1E4,
      h = 1,
      u = null,
      Ea = !0,
      ea = !0,
      na = !1,
      ja = !1,
      G = 0,
      la = !1,
      Fa = !1,
      M = s = ~~((Z + aa) / 2),
      N = t = ~~(($ + ba) / 2),
      O = 1,
      L = "",
      w = null,
      fa = !1,
      P = 0,
      Ra = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
      C = 1,
      pa = "ontouchstart" in f && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      ma = new Image;
    ma.src = "img/split.png";
    P = document.createElement("canvas");

    api.agar.getWindowCenterCoord = function() {  // meow
      // please search some line like:
      // [a-zA-Z] = ([a-zA-Z] - [a-zA-Z] \/ 2) \/ [a-zA-Z] + [a-zA-Z]
      return new math.Vector2D(s, t);
    };

    api.agar.getScale = function() {  // meow
      // please search some line like:
      // [a-zA-Z] = ([a-zA-Z] - [a-zA-Z] \/ 2) \/ [a-zA-Z] + [a-zA-Z]
      return h;
    };

    api.agar.getWindowSize = function() {  // meow
      // please search some line like:
      // [a-zA-Z] = ([a-zA-Z] - [a-zA-Z] \/ 2) \/ [a-zA-Z] + [a-zA-Z]
      return new math.Vector2D(q, r);
    };

    api.agar._updateCirclesInfo = function() {  // meow
      // please search some line like:
      // for ([a-zA-Z] = 0; [a-zA-Z] < [a-zA-Z]\.length; [a-zA-Z]++) [a-zA-Z]\[[a-zA-Z]\]\.draw();
      // for (var [a-zA-Z] = 0, [a-zA-Z] = 0; [a-zA-Z] < [a-zA-Z]\.length; [a-zA-Z]++) [a-zA-Z] += [a-zA-Z]\[[a-zA-Z]\]\.size;
      // destroy: function
      // case: 20
      // prototype -> class name
      var all = n, our = l;
      api.agar._ourCirclesInfo = [];
      api.agar._spikeCirclesInfo = [];
      api.agar._otherCirclesInfo = [];
      for (var i = 0; i < all.length; ++i) {
        var circleInfo = new api.agar.CircleInfo(all[i]);
        if (our.indexOf(all[i]) >= 0) {
          api.agar._ourCirclesInfo.push(circleInfo);
        } else if (all[i].isVirus) {
          api.agar._spikeCirclesInfo.push(circleInfo);
        } else {
          api.agar._otherCirclesInfo.push(circleInfo);
        }
      }
      api.agar._circlesInfoChanged = false;
    };

    if ("undefined" == typeof console || "undefined" == typeof DataView || "undefined" == typeof WebSocket || null == P || null == P.getContext || null == f.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
    else {
      var X = null;
      f.setNick = function(a) {
        va();
        D = a;
        ya();
        G = 0
      };
      f.setRegion = T;
      f.setSkins = function(a) {
        Ea = a
      };
      f.setNames = function(a) {
        ea = a
      };
      f.setDarkTheme = function(a) {
        la = a
      };
      f.setColors = function(a) {
        na = a
      };
      f.setShowMass = function(a) {
        Fa = a
      };
      f.spectate = function() {
        D = null;
        B(1);
        va()
      };
      f.setGameMode = function(a) {
        a != L && (L = a, U())
      };
      null != f.localStorage && (null == f.localStorage.AB8 && (f.localStorage.AB8 = 0 + ~~(100 * Math.random())), P = +f.localStorage.AB8, f.ABGroup = P);
      g.get("http://gc.agar.io", function(a) {
        var b = a.split(" ");
        a = b[0];
        b = b[1] || ""; - 1 == "DE IL PL HU BR AT".split(" ").indexOf(a) && Ga.push("nazi");
        Q.hasOwnProperty(a) && ("string" == typeof Q[a] ? u || T(Q[a]) : Q[a].hasOwnProperty(b) && (u || T(Q[a][b])))
      }, "text");
      setTimeout(function() {}, 3E5);
      var Q = {
        AF: "JP-Tokyo",
        AX: "EU-London",
        AL: "EU-London",
        DZ: "EU-London",
        AS: "SG-Singapore",
        AD: "EU-London",
        AO: "EU-London",
        AI: "US-Atlanta",
        AG: "US-Atlanta",
        AR: "BR-Brazil",
        AM: "JP-Tokyo",
        AW: "US-Atlanta",
        AU: "SG-Singapore",
        AT: "EU-London",
        AZ: "JP-Tokyo",
        BS: "US-Atlanta",
        BH: "JP-Tokyo",
        BD: "JP-Tokyo",
        BB: "US-Atlanta",
        BY: "EU-London",
        BE: "EU-London",
        BZ: "US-Atlanta",
        BJ: "EU-London",
        BM: "US-Atlanta",
        BT: "JP-Tokyo",
        BO: "BR-Brazil",
        BQ: "US-Atlanta",
        BA: "EU-London",
        BW: "EU-London",
        BR: "BR-Brazil",
        IO: "JP-Tokyo",
        VG: "US-Atlanta",
        BN: "JP-Tokyo",
        BG: "EU-London",
        BF: "EU-London",
        BI: "EU-London",
        KH: "JP-Tokyo",
        CM: "EU-London",
        CA: "US-Atlanta",
        CV: "EU-London",
        KY: "US-Atlanta",
        CF: "EU-London",
        TD: "EU-London",
        CL: "BR-Brazil",
        CN: "CN-China",
        CX: "JP-Tokyo",
        CC: "JP-Tokyo",
        CO: "BR-Brazil",
        KM: "EU-London",
        CD: "EU-London",
        CG: "EU-London",
        CK: "SG-Singapore",
        CR: "US-Atlanta",
        CI: "EU-London",
        HR: "EU-London",
        CU: "US-Atlanta",
        CW: "US-Atlanta",
        CY: "JP-Tokyo",
        CZ: "EU-London",
        DK: "EU-London",
        DJ: "EU-London",
        DM: "US-Atlanta",
        DO: "US-Atlanta",
        EC: "BR-Brazil",
        EG: "EU-London",
        SV: "US-Atlanta",
        GQ: "EU-London",
        ER: "EU-London",
        EE: "EU-London",
        ET: "EU-London",
        FO: "EU-London",
        FK: "BR-Brazil",
        FJ: "SG-Singapore",
        FI: "EU-London",
        FR: "EU-London",
        GF: "BR-Brazil",
        PF: "SG-Singapore",
        GA: "EU-London",
        GM: "EU-London",
        GE: "JP-Tokyo",
        DE: "EU-London",
        GH: "EU-London",
        GI: "EU-London",
        GR: "EU-London",
        GL: "US-Atlanta",
        GD: "US-Atlanta",
        GP: "US-Atlanta",
        GU: "SG-Singapore",
        GT: "US-Atlanta",
        GG: "EU-London",
        GN: "EU-London",
        GW: "EU-London",
        GY: "BR-Brazil",
        HT: "US-Atlanta",
        VA: "EU-London",
        HN: "US-Atlanta",
        HK: "JP-Tokyo",
        HU: "EU-London",
        IS: "EU-London",
        IN: "JP-Tokyo",
        ID: "JP-Tokyo",
        IR: "JP-Tokyo",
        IQ: "JP-Tokyo",
        IE: "EU-London",
        IM: "EU-London",
        IL: "JP-Tokyo",
        IT: "EU-London",
        JM: "US-Atlanta",
        JP: "JP-Tokyo",
        JE: "EU-London",
        JO: "JP-Tokyo",
        KZ: "JP-Tokyo",
        KE: "EU-London",
        KI: "SG-Singapore",
        KP: "JP-Tokyo",
        KR: "JP-Tokyo",
        KW: "JP-Tokyo",
        KG: "JP-Tokyo",
        LA: "JP-Tokyo",
        LV: "EU-London",
        LB: "JP-Tokyo",
        LS: "EU-London",
        LR: "EU-London",
        LY: "EU-London",
        LI: "EU-London",
        LT: "EU-London",
        LU: "EU-London",
        MO: "JP-Tokyo",
        MK: "EU-London",
        MG: "EU-London",
        MW: "EU-London",
        MY: "JP-Tokyo",
        MV: "JP-Tokyo",
        ML: "EU-London",
        MT: "EU-London",
        MH: "SG-Singapore",
        MQ: "US-Atlanta",
        MR: "EU-London",
        MU: "EU-London",
        YT: "EU-London",
        MX: "US-Atlanta",
        FM: "SG-Singapore",
        MD: "EU-London",
        MC: "EU-London",
        MN: "JP-Tokyo",
        ME: "EU-London",
        MS: "US-Atlanta",
        MA: "EU-London",
        MZ: "EU-London",
        MM: "JP-Tokyo",
        NA: "EU-London",
        NR: "SG-Singapore",
        NP: "JP-Tokyo",
        NL: "EU-London",
        NC: "SG-Singapore",
        NZ: "SG-Singapore",
        NI: "US-Atlanta",
        NE: "EU-London",
        NG: "EU-London",
        NU: "SG-Singapore",
        NF: "SG-Singapore",
        MP: "SG-Singapore",
        NO: "EU-London",
        OM: "JP-Tokyo",
        PK: "JP-Tokyo",
        PW: "SG-Singapore",
        PS: "JP-Tokyo",
        PA: "US-Atlanta",
        PG: "SG-Singapore",
        PY: "BR-Brazil",
        PE: "BR-Brazil",
        PH: "JP-Tokyo",
        PN: "SG-Singapore",
        PL: "EU-London",
        PT: "EU-London",
        PR: "US-Atlanta",
        QA: "JP-Tokyo",
        RE: "EU-London",
        RO: "EU-London",
        RU: "RU-Russia",
        RW: "EU-London",
        BL: "US-Atlanta",
        SH: "EU-London",
        KN: "US-Atlanta",
        LC: "US-Atlanta",
        MF: "US-Atlanta",
        PM: "US-Atlanta",
        VC: "US-Atlanta",
        WS: "SG-Singapore",
        SM: "EU-London",
        ST: "EU-London",
        SA: "EU-London",
        SN: "EU-London",
        RS: "EU-London",
        SC: "EU-London",
        SL: "EU-London",
        SG: "JP-Tokyo",
        SX: "US-Atlanta",
        SK: "EU-London",
        SI: "EU-London",
        SB: "SG-Singapore",
        SO: "EU-London",
        ZA: "EU-London",
        SS: "EU-London",
        ES: "EU-London",
        LK: "JP-Tokyo",
        SD: "EU-London",
        SR: "BR-Brazil",
        SJ: "EU-London",
        SZ: "EU-London",
        SE: "EU-London",
        CH: "EU-London",
        SY: "EU-London",
        TW: "JP-Tokyo",
        TJ: "JP-Tokyo",
        TZ: "EU-London",
        TH: "JP-Tokyo",
        TL: "JP-Tokyo",
        TG: "EU-London",
        TK: "SG-Singapore",
        TO: "SG-Singapore",
        TT: "US-Atlanta",
        TN: "EU-London",
        TR: "TK-Turkey",
        TM: "JP-Tokyo",
        TC: "US-Atlanta",
        TV: "SG-Singapore",
        UG: "EU-London",
        UA: "EU-London",
        AE: "EU-London",
        GB: "EU-London",
        US: {
          AL: "US-Atlanta",
          AK: "US-Fremont",
          AZ: "US-Fremont",
          AR: "US-Atlanta",
          CA: "US-Fremont",
          CO: "US-Fremont",
          CT: "US-Atlanta",
          DE: "US-Atlanta",
          FL: "US-Atlanta",
          GA: "US-Atlanta",
          HI: "US-Fremont",
          ID: "US-Fremont",
          IL: "US-Atlanta",
          IN: "US-Atlanta",
          IA: "US-Atlanta",
          KS: "US-Atlanta",
          KY: "US-Atlanta",
          LA: "US-Atlanta",
          ME: "US-Atlanta",
          MD: "US-Atlanta",
          MA: "US-Atlanta",
          MI: "US-Atlanta",
          MN: "US-Fremont",
          MS: "US-Atlanta",
          MO: "US-Atlanta",
          MT: "US-Fremont",
          NE: "US-Fremont",
          NV: "US-Fremont",
          NH: "US-Atlanta",
          NJ: "US-Atlanta",
          NM: "US-Fremont",
          NY: "US-Atlanta",
          NC: "US-Atlanta",
          ND: "US-Fremont",
          OH: "US-Atlanta",
          OK: "US-Atlanta",
          OR: "US-Fremont",
          PA: "US-Atlanta",
          RI: "US-Atlanta",
          SC: "US-Atlanta",
          SD: "US-Fremont",
          TN: "US-Atlanta",
          TX: "US-Atlanta",
          UT: "US-Fremont",
          VT: "US-Atlanta",
          VA: "US-Atlanta",
          WA: "US-Fremont",
          WV: "US-Atlanta",
          WI: "US-Atlanta",
          WY: "US-Fremont",
          DC: "US-Atlanta",
          AS: "US-Atlanta",
          GU: "US-Atlanta",
          MP: "US-Atlanta",
          PR: "US-Atlanta",
          UM: "US-Atlanta",
          VI: "US-Atlanta"
        },
        UM: "SG-Singapore",
        VI: "US-Atlanta",
        UY: "BR-Brazil",
        UZ: "JP-Tokyo",
        VU: "SG-Singapore",
        VE: "BR-Brazil",
        VN: "JP-Tokyo",
        WF: "SG-Singapore",
        EH: "EU-London",
        YE: "JP-Tokyo",
        ZM: "EU-London",
        ZW: "EU-London"
      };
      f.connect = xa;
      var Y = 500,
        Ba = -1,
        Ca = -1,
        v = null,
        x = 1,
        ca = null,
        I = {},
        Ga = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal".split(";"),
        Sa = ["8", "nasa"],
        Ta = ["m'blob"];
      Aa.prototype = {
        id: 0,
        points: null,
        pointsAcc: null,
        name: null,
        nameCache: null,
        sizeCache: null,
        x: 0,
        y: 0,
        size: 0,
        ox: 0,
        oy: 0,
        oSize: 0,
        nx: 0,
        ny: 0,
        nSize: 0,
        updateTime: 0,
        updateCode: 0,
        drawTime: 0,
        destroyed: !1,
        isVirus: !1,
        isAgitated: !1,
        wasSimpleDrawing: !0,
        destroy: function() {
          var a;
          for (a = 0; a < n.length; a++)
            if (n[a] == this) {
              n.splice(a, 1);
              break
            }
          delete y[this.id];
          a = l.indexOf(this); - 1 != a && (ja = !0, l.splice(a, 1));
          a = E.indexOf(this.id); - 1 != a && E.splice(a, 1);
          this.destroyed = !0;
          F.push(this)
        },
        getNameSize: function() {
          return Math.max(~~(.3 * this.size), 24)
        },
        setName: function(a) {
          if (this.name = a) null == this.nameCache ? this.nameCache = new da(this.getNameSize(), "#FFFFFF", !0, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
        },
        createPoints: function() {
          for (var a = this.getNumPoints(); this.points.length > a;) {
            var b = ~~(Math.random() * this.points.length);
            this.points.splice(b, 1);
            this.pointsAcc.splice(b, 1)
          }
          0 == this.points.length && 0 < a && (this.points.push({
            c: this,
            v: this.size,
            x: this.x,
            y: this.y
          }), this.pointsAcc.push(Math.random() - .5));
          for (; this.points.length < a;) {
            var b = ~~(Math.random() * this.points.length),
              c = this.points[b];
            this.points.splice(b, 0, {
              c: this,
              v: c.v,
              x: c.x,
              y: c.y
            });
            this.pointsAcc.splice(b, 0, this.pointsAcc[b])
          }
        },
        getNumPoints: function() {
          var a = 10;
          20 > this.size && (a = 5);
          this.isVirus && (a = 30);
          return ~~Math.max(this.size * h * (this.isVirus ? Math.min(2 * x, 1) : x), a)
        },
        movePoints: function() {
          this.createPoints();
          for (var a = this.points, b = this.pointsAcc, c = a.length, d = 0; d < c; ++d) {
            var e = b[(d - 1 + c) % c],
              f = b[(d + 1) % c];
            b[d] += (Math.random() - .5) * (this.isAgitated ? 3 : 1);
            b[d] *= .7;
            10 < b[d] && (b[d] = 10); - 10 > b[d] && (b[d] = -10);
            b[d] = (e + f + 8 * b[d]) / 10
          }
          for (var h = this, d = 0; d < c; ++d) {
            var g = a[d].v,
              e = a[(d - 1 + c) % c].v,
              f = a[(d + 1) % c].v;
            if (15 < this.size && null != K) {
              var l = !1,
                m = a[d].x,
                n = a[d].y;
              K.retrieve2(m - 5, n - 5, 10, 10, function(a) {
                a.c != h && 25 > (m - a.x) * (m - a.x) + (n - a.y) * (n - a.y) && (l = !0)
              });
              !l && (a[d].x < Z || a[d].y < $ || a[d].x > aa || a[d].y > ba) && (l = !0);
              l && (0 < b[d] && (b[d] = 0), b[d] -= 1)
            }
            g += b[d];
            0 > g && (g = 0);
            g = this.isAgitated ? (19 * g + this.size) / 20 : (12 * g + this.size) / 13;
            a[d].v = (e + f + 8 * g) / 10;
            e = 2 * Math.PI / c;
            f = this.points[d].v;
            this.isVirus && 0 == d % 2 && (f += 5);
            a[d].x = this.x + Math.cos(e * d) * f;
            a[d].y = this.y + Math.sin(e * d) * f
          }
        },
        updatePos: function() {
          api.agar._circlesInfoChanged = true;  // meow
          var a;
          a = (H - this.updateTime) / 120;
          a = 0 > a ? 0 : 1 < a ? 1 : a;
          var b = 0 > a ? 0 : 1 < a ? 1 : a;
          this.getNameSize();
          if (this.destroyed && 1 <= b) {
            var c = F.indexOf(this); - 1 != c && F.splice(c, 1)
          }
          this.x = a * (this.nx - this.ox) + this.ox;
          this.y = a * (this.ny - this.oy) + this.oy;
          this.size = b * (this.nSize - this.oSize) + this.oSize;
          return b
        },
        shouldRender: function() {
          return this.x + this.size + 40 < s - q / 2 / h || this.y + this.size + 40 < t - r / 2 / h || this.x - this.size - 40 >
            s + q / 2 / h || this.y - this.size - 40 > t + r / 2 / h ? !1 : !0
        },
        draw: function() {
          if (this.shouldRender()) {
            var a = !this.isVirus && !this.isAgitated && .35 > h;
            if (this.wasSimpleDrawing && !a)
              for (var b = 0; b < this.points.length; b++) this.points[b].v = this.size;
            this.wasSimpleDrawing = a;
            e.save();
            this.drawTime = H;
            b = this.updatePos();
            this.destroyed && (e.globalAlpha *= 1 - b);
            e.lineWidth = 10;
            e.lineCap = "round";
            e.lineJoin = this.isVirus ? "mitter" : "round";
            na ? (e.fillStyle = "#FFFFFF", e.strokeStyle = "#AAAAAA") : (e.fillStyle = this.color, e.strokeStyle = this.color);
            if (a) e.beginPath(), e.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
            else {
              this.movePoints();
              e.beginPath();
              var c = this.getNumPoints();
              e.moveTo(this.points[0].x, this.points[0].y);
              for (b = 1; b <= c; ++b) {
                var d = b % c;
                e.lineTo(this.points[d].x, this.points[d].y)
              }
            }
            e.closePath();
            c = this.name.toLowerCase();
            !this.isAgitated && Ea && "" == L ? -1 != Ga.indexOf(c) ? (I.hasOwnProperty(c) || (I[c] = new Image, I[c].src = "skins/" + c + ".png"), b = 0 != I[c].width && I[c].complete ? I[c] : null) : b = null : b = null;
            b = (d = b) ? -1 != Ta.indexOf(c) : !1;
            a || e.stroke();
            e.fill();
            null == d || b || (e.save(), e.clip(), e.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), e.restore());
            (na || 15 < this.size) && !a && (e.strokeStyle = "#000000", e.globalAlpha *= .1, e.stroke());
            e.globalAlpha = 1;
            null != d && b && e.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
            b = -1 != l.indexOf(this);
            a = ~~this.y;
            if ((ea || b) && this.name && this.nameCache && (null == d || -1 == Sa.indexOf(c))) {
              d = this.nameCache;
              d.setValue(this.name);
              d.setSize(this.getNameSize());
              c = Math.ceil(10 * h) / 10;
              d.setScale(c);
              var d = d.render(),
                f = ~~(d.width / c),
                g = ~~(d.height / c);
              e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
              a += d.height / 2 / c + 4
            }
            Fa && (b || 0 == l.length && (!this.isVirus || this.isAgitated) && 20 < this.size) && (null == this.sizeCache && (this.sizeCache = new da(this.getNameSize() / 2, "#FFFFFF", !0, "#000000")), b = this.sizeCache, b.setSize(this.getNameSize() / 2), b.setValue(~~(this.size * this.size / 100)), c = Math.ceil(10 * h) / 10, b.setScale(c), d = b.render(), f = ~~(d.width / c), g = ~~(d.height / c), e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g));
            e.restore()
          }
        }
      };
      da.prototype = {
        _value: "",
        _color: "#000000",
        _stroke: !1,
        _strokeColor: "#000000",
        _size: 16,
        _canvas: null,
        _ctx: null,
        _dirty: !1,
        _scale: 1,
        setSize: function(a) {
          this._size != a && (this._size = a, this._dirty = !0)
        },
        setScale: function(a) {
          this._scale != a && (this._scale = a, this._dirty = !0)
        },
        setColor: function(a) {
          this._color != a && (this._color = a, this._dirty = !0)
        },
        setStroke: function(a) {
          this._stroke != a && (this._stroke = a, this._dirty = !0)
        },
        setStrokeColor: function(a) {
          this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
        },
        setValue: function(a) {
          a != this._value && (this._value = a, this._dirty = !0)
        },
        render: function() {
          null == this._canvas && (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d"));
          if (this._dirty) {
            this._dirty = !1;
            var a = this._canvas,
              b = this._ctx,
              c = this._value,
              d = this._scale,
              e = this._size,
              f = e + "px Ubuntu";
            b.font = f;
            var g = b.measureText(c).width,
              h = ~~(.2 * e);
            a.width = (g + 6) * d;
            a.height = (e + h) * d;
            b.font = f;
            b.scale(d, d);
            b.globalAlpha = 1;
            b.lineWidth = 3;
            b.strokeStyle = this._strokeColor;
            b.fillStyle = this._color;
            this._stroke && b.strokeText(c, 3, e - h / 2);
            b.fillText(c, 3, e - h / 2)
          }
          return this._canvas
        }
      };
      f.onload = Ha
      Ha();  // meow, Go!!
    }
  }
};


// Known variables:
// p: canvas width
// m: canvas height
// O: window coordinate x
// P: window coordinate y
// Q: absolute coordinate x
// R: absoulte coordinate y
// H: the quad-tree
// $, z: canvas
// e: canvas.getContex('2d')
// g: a list stores our player's circles
// w: a dict stores circles
// q: a list stores circles
// C: for garbage (the one who is destroyed...)
// y: members in the leader board.
