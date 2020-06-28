"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @file src/circle.js
 * @author David Figatner
 * @license MIT
 * Copyright (c) 2016 YOPEY YOPEY LLC
 * {@link https://github.com/davidfig/intersects}
 */
var Shape = require('./shape.js');
/** circle shape */


var Circle = /*#__PURE__*/function (_Shape) {
  _inherits(Circle, _Shape);

  var _super = _createSuper(Circle);

  /**
   * @param {Article} article that uses this shape
   * @param {object} [options] - @see {@link Circle.set}
   */
  function Circle(article, options) {
    var _this;

    _classCallCheck(this, Circle);

    _this = _super.call(this, article);
    _this.SHAPE = 'Circle';
    _this.AABB = [];
    options = options || {};

    _this.set(options);

    return _this;
  }
  /**
   * @param {object} options
   * @param {object} [options.positionObject=this.article] use this to update position
   * @param {number} [options.radius] otherwise article.width / 2 is used as radius
   */


  _createClass(Circle, [{
    key: "set",
    value: function set(options) {
      this.radius = options.radius || this.article.width / 2;
      this.radiusSquared = this.radius * this.radius;
      this.center = options.positionObject ? options.positionObject : this.article;
      this.update();
    }
    /** update AABB */

  }, {
    key: "update",
    value: function update() {
      var AABB = this.AABB;
      var radius = this.radius;
      var center = this.center;
      AABB[0] = center.x - radius;
      AABB[1] = center.y - radius;
      AABB[2] = center.x + radius;
      AABB[3] = center.y + radius;
    }
    /**
     * Does Circle collide with Circle?
     * @param {Circle} circle
     * @return {boolean}
     */

  }, {
    key: "collidesCircle",
    value: function collidesCircle(circle) {
      var thisCenter = this.center;
      var center = circle.center;
      var x = center.x - thisCenter.x;
      var y = center.y - thisCenter.y;
      var radii = circle.radius + this.radius;
      return x * x + y * y <= radii * radii;
    }
    /**
     * Does Circle collide with point?
     * @param {Point} point
     * @return {boolean}
     */

  }, {
    key: "collidesPoint",
    value: function collidesPoint(point) {
      var x = point.x - this.center.x;
      var y = point.y - this.center.y;
      return x * x + y * y <= this.radiusSquared;
    }
    /**
     * Does Circle collide with a line?
     * from http://stackoverflow.com/a/10392860/1955997
     * @param {Point} p1
     * @param {Point} p2
     * @return {boolean}
     */

  }, {
    key: "collidesLine",
    value: function collidesLine(p1, p2) {
      function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
      }

      var center = this.center;
      var ac = [center.x - p1.x, center.y - p1.y];
      var ab = [p2.x - p1.x, p2.y - p1.y];
      var ab2 = dot(ab, ab);
      var acab = dot(ac, ab);
      var t = acab / ab2;
      t = t < 0 ? 0 : t;
      t = t > 1 ? 1 : t;
      var h = [ab[0] * t + p1.x - center.x, ab[1] * t + p1.y - center.y];
      var h2 = dot(h, h);
      return h2 <= this.radiusSquared;
    }
    /**
     * Does circle collide with Rectangle?
     * @param {Rectangle} rectangle
     */

  }, {
    key: "collidesRectangle",
    value: function collidesRectangle(rectangle) {
      // from http://stackoverflow.com/a/402010/1955997
      if (rectangle.noRotate) {
        var AABB = rectangle.AABB;
        var hw = (AABB[2] - AABB[0]) / 2;
        var hh = (AABB[3] - AABB[1]) / 2;
        var center = this.center;
        var radius = this.radius;
        var distX = Math.abs(center.x - AABB[0]);
        var distY = Math.abs(center.y - AABB[1]);

        if (distX > hw + radius || distY > hh + radius) {
          return false;
        }

        if (distX <= hw || distY <= hh) {
          return true;
        }

        var x = distX - hw;
        var y = distY - hh;
        return x * x + y * y <= this.radiusSquared;
      } // from http://stackoverflow.com/a/402019/1955997
      else {
          var _center = this.center;

          if (rectangle.collidesPoint(_center)) {
            return true;
          }

          var vertices = rectangle.vertices;
          return this.collidesLine({
            x: vertices[0],
            y: vertices[1]
          }, {
            x: vertices[2],
            y: vertices[3]
          }) || this.collidesLine({
            x: vertices[2],
            y: vertices[3]
          }, {
            x: vertices[4],
            y: vertices[5]
          }) || this.collidesLine({
            x: vertices[4],
            y: vertices[5]
          }, {
            x: vertices[6],
            y: vertices[7]
          }) || this.collidesLine({
            x: vertices[6],
            y: vertices[7]
          }, {
            x: vertices[0],
            y: vertices[1]
          });
        }
    } // from http://stackoverflow.com/a/402019/1955997

  }, {
    key: "collidesPolygon",
    value: function collidesPolygon(polygon) {
      var center = this.center;

      if (polygon.collidesPoint(center)) {
        return true;
      }

      var vertices = polygon.vertices;
      var count = vertices.length;

      for (var i = 0; i < count - 2; i += 2) {
        if (this.collidesLine({
          x: vertices[i],
          y: vertices[i + 1]
        }, {
          x: vertices[i + 2],
          y: vertices[i + 3]
        })) {
          return true;
        }
      }

      return this.collidesLine({
        x: vertices[0],
        y: vertices[1]
      }, {
        x: vertices[count - 2],
        y: vertices[count - 1]
      });
    }
  }]);

  return Circle;
}(Shape);
