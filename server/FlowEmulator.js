var Rx          = require('rx')
    Rx          = require('./rx.helpers')
    ;

function identity (x) { return x; }; 

module.exports = (function () {

  Rx.Internals.inherits(FlowEmulator, Rx.Observable);

  function FlowEmulator (solenoidSubject, flowMeterSubject, mapFunc) {

    this.subject =
      solenoidSubject
        .distinctUntilChanged()
        .delay(500)
        .select(mapFunc || identity)
        .onNextToObserver(flowMeterSubject)
        .publish().refCount();
  };

  FlowEmulator.prototype._subscribe = function (o) {
    return this.subject.subscribe(o);
  };

  return FlowEmulator;
  
})();