var Rx = require ('rx');

Rx.Observable.prototype.log = function () {
  var args = arguments;
  return this.doAction(function (x) {
    var s = x.toString();
    var mappedArgs = Array.prototype.map.call(args, function (value) {
      if (typeof value === 'string') {
        return value.replace("{{x}}", s);
      }
      return value;
    });
    console.log.apply(console, mappedArgs);
  });
};

Rx.Observable.prototype.onNextToObserver = function (observer, value) {
  var override = arguments.length == 2;
  return this.doAction(function (x) {
    observer.onNext(override ? value : x);
  })
};

Rx.Observable.prototype.waitUntil = function (obs) {
  return this.selectMany(function (x) {
    return obs.take(1).select(function () { return x; });
  })
};

module.exports = Rx;