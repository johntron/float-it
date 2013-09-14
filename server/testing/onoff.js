var Rx = require('rx');

exports.version = '0.1.6';

var notImplemented = "Not Implemented";

function observerFromObserverOrFunc (observerOrFunc) {
  typeof callback === 'function' ? new Rx.callback(callback) : callback;
};

var Gpio = exports.Gpio = (function () {

  function Gpio(gpio, direction, edge, options) {
    this.gpio       = gpio;
    this.direction  = direction;
    this.edge       = edge;
    this.options    = options;
    this.behavior   = new Rx.BehaviorSubject(0);
  };

  Gpio.prototype.read = function (callback) {
    throw notImplemented;
  };

  Gpio.prototype.readSync = function () {
    throw notImplemented;
  };

  Gpio.prototype.write = function (value, callback) {
    this.behavior.onNext(value);
    if (callback) { callback(this.behavior.value); }
  };

  Gpio.prototype.writeSync = function (value) {
    throw notImplemented;
  };

  Gpio.prototype.watch = function (callback) {
    if (callback) {
      this.behavior.subscribe(function (x) {
        callback(undefined, x);
      });
    }
  };

  Gpio.prototype.direction = function() {
    throw notImplemented;
  };

  Gpio.prototype.edge = function() {
    throw notImplemented;
  };

  Gpio.prototype.options = function() {
    throw notImplemented;
  };

  Gpio.prototype.unexport = function(callback) {
    throw notImplemented;
  };

  return Gpio;

})();