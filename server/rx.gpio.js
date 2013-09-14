var Rx    = require('rx'),
    Gpio  = require('./testing/onoff').Gpio
    ;

Rx.GpioSubject = (function () {

  Rx.Internals.inherits(GpioSubject, Rx.Observable);

  function GpioSubject (pin, direction) {
    var gpio = this.gpio = new Gpio(pin, direction);
    this.subject =
      Rx.Observable.create(function (o) {
        gpio.watch(function (err, value) {
          if (err) { o.onError(err); return; }
          o.onNext(value);
        });
      })
      .replay(null, 1).refCount();
  };

  GpioSubject.prototype.onNext = function (value) {
    this.gpio.write(value);
  };

  GpioSubject.prototype._subscribe = function (o) {
    return this.subject.subscribe(o);
  };

  return GpioSubject;

})();

module.exports = Rx;