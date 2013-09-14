var Rx          = require('rx')
    ;

function identity (x) { return x; }; 

module.exports = (function () {

  Rx.Internals.inherits(FlowEmulator, Rx.Observable);

  function FlowEmulator (solenoidSubject, flowMeterSubject, mapFunc) {

    this.subject =
      solenoidSubject
        .distinctUntilChanged()
        .select(mapFunc || identity)
        .doAction(function (value) {
            flowMeterSubject.onNext(value);
        })
        .publish().refCount();
  };

  FlowEmulator.prototype._subscribe = function (o) {
    return this.subject.subscribe(o);
  };

  return FlowEmulator;
  
})();